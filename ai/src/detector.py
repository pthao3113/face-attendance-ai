"""Face Detector module implementing OpenCV / MediaPipe detection interfaces."""

import cv2
import numpy as np
from typing import List, Tuple, Dict, Any, Optional


class FaceDetector:
    """Wrapper class for face detection algorithms (OpenCV / MediaPipe)."""

    def __init__(self, min_confidence: float = 0.5):
        self.min_confidence = min_confidence
        # Load default Haar cascade for basic detection pipeline
        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        self.classifier = cv2.CascadeClassifier(cascade_path)

    def detect_faces(self, image: np.ndarray) -> List[Dict[str, Any]]:
        """Detect faces in the given BGR image array.
        
        Args:
            image: BGR image numpy array.
            
        Returns:
            List of dicts containing bbox (x, y, w, h) and confidence scores.
        """
        if image is None or image.size == 0:
            return []

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = self.classifier.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )

        results = []
        for (x, y, w, h) in faces:
            results.append({
                "bbox": (int(x), int(y), int(w), int(h)),
                "confidence": float(self.min_confidence),
                "landmarks": None
            })

        return results

    def crop_face(self, image: np.ndarray, bbox: Tuple[int, int, int, int]) -> Optional[np.ndarray]:
        """Crop face ROI given a bounding box tuple (x, y, w, h)."""
        x, y, w, h = bbox
        h_img, w_img = image.shape[:2]

        x1, y1 = max(0, x), max(0, y)
        x2, y2 = min(w_img, x + w), min(h_img, y + h)

        if x2 <= x1 or y2 <= y1:
            return None

        return image[y1:y2, x1:x2]
