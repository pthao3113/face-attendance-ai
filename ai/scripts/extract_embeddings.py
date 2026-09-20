#!/usr/bin/env python3
"""Script to extract face embeddings from image dataset and save serialized vectors."""

import os
import pickle
import argparse
import numpy as np
from pathlib import Path

# Paths default configuration
BASE_DIR = Path(__file__).resolve().parent.parent
KNOWN_FACES_DIR = BASE_DIR / "data" / "known_faces"
EMBEDDINGS_DIR = BASE_DIR / "data" / "embeddings"


def extract_embeddings(faces_dir: Path, output_dir: Path) -> None:
    """Read images from faces_dir, compute embeddings, and export to output_dir."""
    print(f"[*] Scanning faces directory: {faces_dir}")
    os.makedirs(output_dir, exist_ok=True)

    known_embeddings = {}

    # Placeholder logic for dataset scanning & feature extraction
    valid_extensions = {".jpg", ".jpeg", ".png", ".bmp"}
    image_files = [f for f in faces_dir.iterdir() if f.suffix.lower() in valid_extensions]

    print(f"[*] Found {len(image_files)} sample image(s).")

    for img_path in image_files:
        user_id = img_path.stem
        print(f" [+] Processing face image for: {user_id}")

        # Placeholder: Generate 128-dimensional normalized dummy feature vector
        np.random.seed(hash(user_id) % (2**32))
        raw_vec = np.random.randn(128)
        norm_vec = raw_vec / np.linalg.norm(raw_vec)

        known_embeddings[user_id] = norm_vec

    output_file = output_dir / "known_embeddings.pkl"
    with open(output_file, "wb") as f:
        pickle.dump(known_embeddings, f)

    print(f"[✓] Extracted embeddings for {len(known_embeddings)} identities saved to: {output_file}")


def main():
    parser = argparse.ArgumentParser(description="Extract facial embeddings from known_faces dataset.")
    parser.add_argument("--faces-dir", type=str, default=str(KNOWN_FACES_DIR), help="Path to known faces directory")
    parser.add_argument("--output-dir", type=str, default=str(EMBEDDINGS_DIR), help="Path to output embeddings directory")
    args = parser.parse_args()

    extract_embeddings(Path(args.faces_dir), Path(args.output_dir))


if __name__ == "__main__":
    main()
