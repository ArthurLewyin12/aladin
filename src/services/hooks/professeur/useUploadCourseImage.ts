import { useMutation } from "@tanstack/react-query";
import { uploadCourseImage } from "@/services/controllers/professeur.controller";
import { toast } from "@/lib/toast";

/**
 * Hook de mutation pour uploader une image dans un cours.
 *
 * @example
 * const { mutate: uploadImage, isPending } = useUploadCourseImage();
 *
 * uploadImage({ image: file, coursId: 123 }, {
 *   onSuccess: (data) => {
 *     console.log("Image URL:", data.url);
 *   }
 * });
 */
export const useUploadCourseImage = () => {
  return useMutation({
    mutationFn: ({
      image,
      coursId,
    }: {
      image: File;
      coursId?: number;
    }) => uploadCourseImage(image, coursId),
    onSuccess: (data) => {
      toast({
        variant: "success",
        message: "Image uploadée avec succès !",
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de l'upload de l'image", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de l'upload de l'image.";
      toast({
        variant: "error",
        message: errorMessage,
      });
    },
  });
};
