import argparse

import cv2
import supervision as sv

from inference.models.utils import get_roboflow_model


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Speed detection')
    parser.add_argument('--source_video_path', required=True, type=str, help='Path to source video file')
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_arguments()
    video_info = sv.VideoInfo.from_video_path(args.source_video_path)
    model = get_roboflow_model("yolov8x-640")

    bounding_box_annotator = sv.BoxCornerAnnotator(thickness=1)
    frame_generator = sv.get_video_frames_generator(args.source_video_path)
    text_annotator = sv.LabelAnnotator(text_scale=1, text_thickness=1)

    for frame in frame_generator:
        result = model.infer(frame)[0]
        detections = sv.Detections.from_inference(result)

        annotated_frame = frame.copy()
        annotated_frame = bounding_box_annotator.annotate(scene=annotated_frame, detections=detections)
        annotated_frame = text_annotator.annotate(scene=annotated_frame, detections=detections)

        cv2.imshow("Speed Screen", annotated_frame)
        if cv2.waitKey(1) == ord('q'):
            break
    cv2.destroyAllWindows()
