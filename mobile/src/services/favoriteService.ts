const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function addEventToFavorites(id_user: string, id_event: number) {
    const response = await fetch(`${API_URL}/favorites-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user, id_event }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'ajout du favori");
    }
    return response.json();
}
export async function removeEventFromFavorites(id_user: string, id_event: number) {
    const response = await fetch(`${API_URL}/favorites-event`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user, id_event }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression du favori");
    }
    return response.json();
}
export async function addBandToFavorites(id_user: string, id_band: number) {
    const response = await fetch(`${API_URL}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user, id_band }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'ajout du favori");
    }
    return response.json();
}

export async function removeBandFromFavorites(id_user: string, id_band: number) {
    const response = await fetch(`${API_URL}/favorites`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user, id_band }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression du favori");
    }
    return response.json();
}