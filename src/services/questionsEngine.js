import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY,
  {
    auth: {
      navigatorLock: false, // This is the secret sauce to fix the AbortError
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);

export const getQuestionsForSubject = async (subject) => {
  const cleanSubject = subject.toLowerCase().trim();

  // 1. Check if we have questions in Supabase already
  const { data: localQuestions } = await supabase
    .from("past_questions")
    .select("*")
    .eq("subject", cleanSubject)
    .limit(5);

  // If we have enough locally, return them immediately
  if (localQuestions && localQuestions.length >= 3) {
    return localQuestions;
  }

  // 2. If not enough locally, fetch a fresh one from ALOC
  try {
    const response = await fetch(
      `https://questions.aloc.com.ng/api/v2/q?subject=${cleanSubject}`,
      {
        headers: { AccessToken: import.meta.env.VITE_ALOC_TOKEN },
      },
    );

    const resData = await response.json();
    const q = resData.data;

    if (q) {
      // Create the 'formatted' object AFTER you get the data from ALOC
      const formatted = {
        subject: cleanSubject,
        question: q.question,
        option_a: q.option.a,
        option_b: q.option.b,
        option_c: q.option.c,
        option_d: q.option.d,
        correct_option: q.answer.toUpperCase(),
        explanation: q.solution || "No explanation provided.",
        year: q.examyear,
      };

      // 3. Save to Supabase (ONLY if it's new)
      const { error: upsertError } = await supabase
        .from("past_questions")
        .upsert([formatted], {
          onConflict: "question", // This column must have a UNIQUE constraint in Supabase
          ignoreDuplicates: true,
        });

      if (upsertError)
        console.warn("Supabase Save Warning:", upsertError.message);

      // Return the new question combined with any existing ones
      return localQuestions ? [...localQuestions, formatted] : [formatted];
    }
  } catch (err) {
    console.error("Sync error:", err);
  }
  console.log(localQuestions);
  return localQuestions || [];
};
