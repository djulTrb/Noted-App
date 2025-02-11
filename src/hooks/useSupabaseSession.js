import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabaseClient";

const useSupabaseSession = () => {
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ["supabase-session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw new Error(error.message);
      return data.session;
    },
  });
  return { data, isLoading, error, isSuccess };
};

export default useSupabaseSession;
