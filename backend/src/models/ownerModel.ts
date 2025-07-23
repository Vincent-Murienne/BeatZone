import { supabase } from "../db";

export const fetchOwnerByIdUser = async (userId: string) => {
    const { data, error } = await supabase
        .from("owner")
        .select("*")
        .eq("id_user", userId)
        .single();

    if (error) {
        throw new Error(`Error fetching owner info: ${error.message}`);
    }

    return data;
}

export const updateOwner = async (id_owner: string, ownerData: any) => {
    const { data, error } = await supabase
        .from("owner")
        .update(ownerData)
        .eq("id_owner", id_owner)
        .single();

    if (error) {
        throw new Error(`Error updating owner info: ${error.message}`);
    }

    return data;
}