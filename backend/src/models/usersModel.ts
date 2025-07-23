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

export const updateUser = async (userId: string, userData: any) => {
    const { data, error } = await supabase
        .from("users")
        .update(userData)
        .eq("id_user", userId)
        .single();

    if (error) {
        throw new Error(`Error updating user info: ${error.message}`);
    }

    return data;
}