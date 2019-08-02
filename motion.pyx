import cv2
import numpy as np
cimport numpy as np
import imutils
from imutils import perspective
from imutils import contours as _contours

cdef class MotionDetection:
    model = cv2.bgsegm.createBackgroundSubtractorMOG(
        history=5000,
        nmixtures=5,
        backgroundRatio=0.0001
    )
    cdef np.ndarray background(self, frame):
        cdef np.ndarray background = self.model.apply(frame)
        background = cv2.GaussianBlur(background, (7, 7), 0)
        #background = cv2.Canny(background, 50, 100)
        #background = cv2.dilate(background, None, iterations=1)
        #background = cv2.erode(background, None, iterations=1)
        return background
    
    cdef np.ndarray foreground(self, frame, background):
        cdef np.ndarray foreground = frame.copy()
        foreground[:, :, 0][background == 0] = 0
        foreground[:, :, 1][background == 0] = 0
        foreground[:, :, 2][background == 0] = 0
        return foreground

    def predict(self, np.ndarray frame, unsigned int thr=400):
        cdef np.ndarray background = self.background(frame)
        cdef np.ndarray foreground = self.foreground(frame, background)
        countours, _ = cv2.findContours(background, 1, 1)
        #countours = imutils.grab_contours(countours)
        #(countours, _) = _contours.sort_contours(countours)
        cdef list boxes = []
        cdef tuple area
        cdef np.ndarray box
        for countour in countours:
            area = cv2.minAreaRect(countour)
            (x, y), (w, h), a = area
            if w * h >= thr:
                box = cv2.boxPoints(area)
                boxes.append(box)
        return np.array(boxes), background, foreground
colors = ((0, 0, 255), (240, 0, 159), (255, 0, 0), (255, 255, 0))

cdef class BackgroundDetection:
    cdef np.ndarray background
    cdef np.ndarray image
    def __init__(self, width, height, channels):
        self.background = np.zeros((width, height))
        self.image = np.zeros((width, height, channels))

    cdef _apply(self, image, background):
        self.image[:, :, 0][background == 0] = image[:, :, 0][background == 0]
        self.image[:, :, 1][background == 0] = image[:, :, 1][background == 0]
        self.image[:, :, 2][background == 0] = image[:, :, 2][background == 0]
        return self.image
    
    def apply(self, image, background):
        return self._apply(image, background)