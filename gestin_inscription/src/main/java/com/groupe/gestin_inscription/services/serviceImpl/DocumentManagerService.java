package com.groupe.gestin_inscription.services.serviceImpl;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.opencv.core.Mat;
import org.opencv.core.MatOfRect;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.objdetect.CascadeClassifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.groupe.gestin_inscription.repository.DocumentRepository;

import boofcv.alg.filter.binary.GThresholdImageOps;
import boofcv.alg.filter.blur.BlurImageOps;
import boofcv.io.image.ConvertBufferedImage;
import boofcv.io.image.UtilImageIO;
import boofcv.struct.ConfigLength;
import boofcv.struct.image.GrayF32;
import boofcv.struct.image.GrayU8;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentManagerService {

    private final Path secureStoragePath = Paths.get("path/to/your/secure/storage");
    private final DocumentRepository documentRepository;

    /**
     * Verifies the file format and size.
     * SIMPLIFIED VERSION: Only checks file extension and size, not document type.
     *
     * @param documentType The type of document (not used in simplified version).
     * @param file The MultipartFile containing the file content.
     * @return True if the format and size are valid, false otherwise.
     */
    public boolean verifyFormat(String documentType, MultipartFile file) {
        if (file == null) {
            log.warn("File is null");
            return false;
        }
        
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            log.warn("File has no name");
            return false;
        }
        
        String fileExtension = getFileExtension(originalFilename).toLowerCase();
        long fileSize = file.getSize();

        // Log for debugging
        log.debug("Validating file: {}, type: {}, extension: {}, size: {}", 
            originalFilename, documentType, fileExtension, fileSize);

        // Check for general file size limit (max 5MB)
        if (fileSize > 5 * 1024 * 1024) {
            log.warn("File size exceeds 5MB: {} bytes for file: {}", fileSize, originalFilename);
            return false;
        }

        // ✅ SIMPLIFIED: Just check if extension is allowed (accepts frontend types)
        boolean isValidExtension = fileExtension.equals("pdf") || 
                                  fileExtension.equals("jpg") || 
                                  fileExtension.equals("jpeg") || 
                                  fileExtension.equals("png");
        
        if (!isValidExtension) {
            log.warn("Invalid file extension: {} for file: {}", fileExtension, originalFilename);
        }
        
        return isValidExtension;
    }

    /**
     * Saves the uploaded file to a secure, persistent storage location.
     *
     * @param file The MultipartFile to save.
     * @return The secure path to the saved file.
     * @throws IOException if there's an error saving the file.
     */
    public String saveSecurely(MultipartFile file) throws IOException {
        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path destinationFile = this.secureStoragePath.resolve(Paths.get(uniqueFileName));

        // Ensure the directory exists
        Files.createDirectories(destinationFile.getParent());

        Files.copy(file.getInputStream(), destinationFile);
        
        log.info("File saved securely: {}", destinationFile);

        return destinationFile.toString();
    }

    /**
     * Performs partial OCR on specific documents like academic transcripts.
     * @param filePath The path to the document file.
     * @return True if the OCR check is successful, false otherwise.
     */
    public boolean performOcrCheck(String filePath) {
        // 1. Initialize the OCR engine
        Tesseract tesseract = new Tesseract();

        // 2. Read the image/PDF file
        File documentFile = new File(filePath);

        if (!documentFile.exists()) {
            log.error("File not found at: {}", filePath);
            return false;
        }

        try {
            // 3. Call the OCR engine to extract text
            String extractedText = tesseract.doOCR(documentFile);

            // 4. Analyze the extracted text
            if (extractedText.contains("relevé de notes") || extractedText.contains("Baccalauréat")) {
                log.info("Partial OCR successful. Document identified as an academic record.");
                return true;
            } else {
                log.warn("Partial OCR failed. Key keywords not found.");
                return false;
            }
        } catch (TesseractException e) {
            log.error("Error during OCR processing: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Detects watermarks on documents like birth certificates.
     *
     * @param filePath The path to the document file.
     * @param fileType The type of document for threshold adjustment.
     * @return True if a watermark is detected, false otherwise.
     */
    public boolean detectWatermark(String filePath, String fileType) {
        // Step 1: Read the image file from the specified path
        BufferedImage originalImage;
        originalImage = UtilImageIO.loadImage(String.valueOf(new File(filePath)));
        if (originalImage == null) {
            log.error("Error: Could not read image from file path: {}", filePath);
            return false;
        }

        // Step 2: Convert the image to a grayscale format for processing
        GrayF32 grayImage = ConvertBufferedImage.convertFromSingle(originalImage,null, GrayF32.class);

        // Step 3: Apply a Gaussian blur to smooth the image and remove noise
        GrayF32 blurredImage = new GrayF32(grayImage.width, grayImage.height);
        BlurImageOps.gaussian(grayImage, blurredImage, -1, 2, null);

        // Step 4: Detect the watermark by applying a local threshold
        GrayU8 binaryImage = new GrayU8(grayImage.width, grayImage.height);
        GThresholdImageOps.localMean(blurredImage, binaryImage, ConfigLength.fixed(15), 0.05F, true, null, null, null);

        // Step 5: Count the number of white pixels (potential watermark regions)
        int whitePixelCount = 0;
        for (int y = 0; y < binaryImage.height; y++) {
            for (int x = 0; x < binaryImage.width; x++) {
                if (binaryImage.get(x, y) == 255) {
                    whitePixelCount++;
                }
            }
        }

        // Step 6: Define a HEURISTIC using document type
        double watermarkThreshold = 0.05; // Default to 5%

        if ("Acte de naissance".equalsIgnoreCase(fileType) || 
            "BIRTH_CERTIFICATE".equalsIgnoreCase(fileType)) {
            watermarkThreshold = 0.02;
        } else if ("Diplôme".equalsIgnoreCase(fileType) || 
                   "BAC".equalsIgnoreCase(fileType)) {
            watermarkThreshold = 0.08;
        }

        // Step 7: Final calculation
        double totalPixels = grayImage.width * grayImage.height;
        double watermarkPercentage = (double) whitePixelCount / totalPixels;

        log.debug("Watermark detection - Percentage: {}%, Threshold: {}%", 
            watermarkPercentage * 100, watermarkThreshold * 100);

        if (watermarkPercentage > watermarkThreshold) {
            log.info("Watermark detected for file: {}", filePath);
            return true;
        } else {
            log.info("No watermark detected for file: {}", filePath);
            return false;
        }
    }

    /**
     * Verifies the ratio and facial presence in an ID photo.
     *
     * @param filePath The path to the ID photo.
     * @return True if the photo meets the criteria, false otherwise.
     */
    public boolean verifyPhotoRatio(String filePath) {
        try {
            File imageFile = new File(filePath);
            if (!imageFile.exists()) {
                log.error("File not found at: {}", filePath);
                return false;
            }
            BufferedImage image = ImageIO.read(imageFile);

            if (image == null) {
                log.error("Could not read image file at: {}", filePath);
                return false;
            }

            // Check ratio
            double width = image.getWidth();
            double height = image.getHeight();
            double aspectRatio = width / height;
            double targetRatio = 3.5 / 4.5;
            double tolerance = 0.05;
            
            if (Math.abs(aspectRatio - targetRatio) > tolerance) {
                log.warn("Photo ratio verification failed. Actual ratio: {}", aspectRatio);
                return false;
            }

            // Face detection
            Mat imageMat = Imgcodecs.imread(filePath);
            CascadeClassifier faceDetector = new CascadeClassifier(
                getClass().getResource("/haarcascade_frontalface_alt.xml").getPath()
            );
            MatOfRect faceDetections = new MatOfRect();
            faceDetector.detectMultiScale(imageMat, faceDetections);
            
            if (faceDetections.toArray().length == 0) {
                log.warn("No face detected in the photo: {}", filePath);
                return false;
            }

            log.info("Photo ratio and face detection passed for file: {}", filePath);
            return true;

        } catch (IOException e) {
            log.error("Error processing image: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Checks for document similarity using file hash.
     *
     * @param filePath The path to the new document file.
     * @return true if a similar document is found, false otherwise.
     */
    public boolean checkForSimilarity(String filePath) {
        String newDocumentHash = generateFileHash(filePath);
        if (newDocumentHash == null) {
            return false;
        }

        boolean isDuplicate = documentRepository.findByHash(newDocumentHash).isPresent();

        if (isDuplicate) {
            log.warn("ALERT: Similar document detected for file at: {}", filePath);
        }

        return isDuplicate;
    }

    /**
     * Generate SHA-256 hash of a file.
     */
    private String generateFileHash(String filePath) {
        try (FileInputStream fis = new FileInputStream(filePath)) {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                digest.update(buffer, 0, bytesRead);
            }
            byte[] hashedBytes = digest.digest();
            return new BigInteger(1, hashedBytes).toString(16);
        } catch (IOException | NoSuchAlgorithmException e) {
            log.error("Error generating file hash: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Extract file extension from filename.
     */
    String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }
        int dotIndex = fileName.lastIndexOf('.');
        return (dotIndex == -1) ? "" : fileName.substring(dotIndex + 1);
    }
}