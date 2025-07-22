import { supabase } from "../db";

export const getUsersInfo = async (userId: string) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id_user", userId)
        .single();

    if (error) {
        throw new Error(`Error fetching user info: ${error.message}`);
    }

    return data;
}