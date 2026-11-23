import axios from "axios";
import Compressor from "compressorjs";
import slugify from "slugify";
import { blobToBase64String, createObjectURL } from "blob-util";
import { NewFileDTO, paths } from "@lessoneditor/contracts";

export const MAX_IMAGE_SIZE = 5000000;

export class ImageUploadError extends Error {}

const compress = (file: File) =>
  new Promise<Blob>((resolve, reject) => {
    new Compressor(file, {
      maxHeight: 1080,
      maxWidth: 1080,
      resize: "cover",
      quality: 0.6,
      success: resolve,
      error: reject,
    });
  });

/**
 * Uploads an image to the lesson as the image button does (ImageUpload): the same size limit,
 * name and compression. Resolves to the file's name on the server (it may be renamed, bilde-2.png)
 * and a URL the preview can show it from right away.
 */
export async function uploadLessonImage(lessonId: number | string, file: File) {
  if (file.size > MAX_IMAGE_SIZE) throw new ImageUploadError("Bildet kan ikke være over 5 MB.");
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : file.type.split("/")[1];
  const ext = `.${extension === "jpg" ? "jpeg" : extension}`;
  const filename =
    slugify(file.name.replace(/\.[^.]*$/, ""), { lower: true, strict: true }) || "bilde";
  try {
    const blob = ext === ".gif" ? file : await compress(file);
    const content = await blobToBase64String(blob);
    const dto: NewFileDTO = { filename, ext, content };
    const { data: saved } = await axios.post<{ filename: string; ext: string }>(
      paths.LESSON_FILES.replace(":lessonId", String(lessonId)),
      dto,
    );
    return { name: saved.filename + saved.ext, url: createObjectURL(blob) };
  } catch (error) {
    console.error(error);
    throw new ImageUploadError("Bildet ble ikke lastet opp. Prøv igjen.");
  }
}
