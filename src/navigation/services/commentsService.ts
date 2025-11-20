
// services/commentsService.ts
import { API_BASE_URL } from "@env";

export type CommentItem = {
	stars: number;
	comment: string;
	title: string;
	created_at: string;
	aroma: string | null;
	first_name?: string;
	last_name?: string;
};

export type CommentsPage = {
	count: number; // toplam yorum adedi (ör: 16)
	results: CommentItem[]; // bu sayfada gösterilecekler (ör: ilk 10)
};

export const getProductComments = async (productSlug: string, limit = 10, offset = 0): Promise<CommentsPage> => {
	try {
		const res = await fetch(`${API_BASE_URL}/products/${productSlug}/comments?limit=${limit}&offset=${offset}`);

		if (!res.ok) {
			throw new Error(`HTTP ${res.status}`);
		}

		const json = await res.json();
		const data = json?.data ?? json;

		return {
			count: data?.count ?? 0,
			results: (data?.results ?? []).map((it: any) => ({
				...it,
				// stars api'de "5" string gelebilir
				stars: Math.max(1, Math.min(5, Number(it.stars) || 0)),
			})),
		};
	} catch (err) {
		console.error("getProductComments hata:", err);
		return { count: 0, results: [] };
	}
};
