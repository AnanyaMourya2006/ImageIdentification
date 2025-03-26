


import org.tensorflow.Graph;
import org.tensorflow.Session;
import org.tensorflow.Tensor;
import org.tensorflow.framework.GraphDef;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.FloatBuffer;

public class ImageClassifier {

    private static final String MODEL_PATH = "path_to_your_model/model.pb";  // Path to your model
    private static final String IMAGE_PATH = "path_to_your_image/image.jpg"; // Path to your image

    public static void main(String[] args) {
        try {
            // Load the trained model
            byte[] graphBytes = Files.readAllBytes(Paths.get(MODEL_PATH));
            try (Graph graph = new Graph()) {
                graph.importGraphDef(graphBytes);
                
                // Start a session to run inference
                try (Session session = new Session(graph)) {
                    // Load and preprocess the image
                    BufferedImage img = ImageIO.read(new File(IMAGE_PATH));
                    img = resizeImage(img, 224, 224);  // Resize the image to 224x224
                    Tensor<Float> imageTensor = imageToTensor(img);
                    
                    // Run the model
                    Tensor<?> result = session.runner()
                            .feed("input_tensor_name", imageTensor)  // Replace with your model's input tensor name
                            .fetch("output_tensor_name")             // Replace with your model's output tensor name
                            .run().get(0);

                    // Output the prediction (for simplicity, print the tensor)
                    System.out.println(result.toString());
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static Tensor<Float> imageToTensor(BufferedImage image) {
        int height = image.getHeight();
        int width = image.getWidth();
        int channels = 3; // RGB image

        // Create a tensor from the image data
        float[][][] imageData = new float[height][width][channels];
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                Color color = new Color(image.getRGB(x, y));
                imageData[y][x][0] = color.getRed() / 255.0f;
                imageData[y][x][1] = color.getGreen() / 255.0f;
                imageData[y][x][2] = color.getBlue() / 255.0f;
            }
        }

        // Return a Tensor object for the image data
        return Tensor.create(new long[]{1, height, width, channels}, 
                             FloatBuffer.wrap(imageData));
    }

    private static BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        Image tmp = originalImage.getScaledInstance(targetWidth, targetHeight, Image.SCALE_SMOOTH);
        BufferedImage resized = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = resized.createGraphics();
        g2d.drawImage(tmp, 0, 0, null);
        g2d.dispose();
        return resized;
    }
}
