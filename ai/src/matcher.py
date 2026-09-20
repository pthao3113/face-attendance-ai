"""Face Feature Vector Matcher module."""

import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from sklearn.metrics.pairwise import cosine_similarity


class FaceMatcher:
    """Matcher engine to compare face embedding vectors."""

    def __init__(self, threshold: float = 0.6):
        self.threshold = threshold

    @staticmethod
    def compute_cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
        """Compute cosine similarity score between two 1D vector arrays."""
        v1 = vec1.reshape(1, -1)
        v2 = vec2.reshape(1, -1)
        return float(cosine_similarity(v1, v2)[0][0])

    @staticmethod
    def compute_euclidean_distance(vec1: np.ndarray, vec2: np.ndarray) -> float:
        """Compute Euclidean distance between two 1D vector arrays."""
        return float(np.linalg.norm(vec1 - vec2))

    def find_best_match(
        self,
        query_embedding: np.ndarray,
        known_embeddings: Dict[str, np.ndarray]
    ) -> Tuple[Optional[str], float]:
        """Find best matching identity from registered known embeddings.

        Args:
            query_embedding: Target embedding vector.
            known_embeddings: Mapping of user identity IDs to reference embedding vectors.

        Returns:
            Tuple of (matched_user_id, similarity_score). Returns (None, score) if below threshold.
        """
        if not known_embeddings or query_embedding is None:
            return None, 0.0

        best_user_id = None
        highest_score = -1.0

        for user_id, ref_embedding in known_embeddings.items():
            score = self.compute_cosine_similarity(query_embedding, ref_embedding)
            if score > highest_score:
                highest_score = score
                best_user_id = user_id

        if highest_score >= self.threshold:
            return best_user_id, highest_score

        return None, highest_score
