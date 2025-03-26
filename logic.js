
   // Ensure TensorFlow.js is loaded
if (typeof tf === 'undefined') {
    console.error('TensorFlow.js is not loaded.');
} else {
    console.log('TensorFlow.js is loaded');
}

let model;

// Load the pre-trained model
async function loadModel() {
    try {
        model = await tf.loadLayersModel('https://storage.googleapis.com/tm-models/your_model_url/model.json'); // Replace with your model URL
        console.log("Model loaded successfully!");
    } catch (error) {
        console.error("Error loading model:", error);
    }
}

// Preprocess the image to match the model input size
function preprocessImage(imageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    // Resize the image to match the model's expected input (e.g., 224x224)
    return tf.browser.fromPixels(canvas)
        .resizeBilinear([224, 224])  // Resize the image
        .toFloat()                   // Convert to float tensor
        .div(tf.scalar(255))          // Normalize the image to [0, 1]
        .expandDims(0);               // Add batch dimension
}

// Predict the class of the uploaded image
async function predict() {
    if (!model) {
        console.error("Model is not loaded yet.");
        return;
    }

    const imageElement = document.getElementById('uploadedImage');
    const tensor = preprocessImage(imageElement);
    
    try {
        const predictions = await model.predict(tensor).data();
        const classId = predictions.indexOf(Math.max(...predictions));
        const confidence = predictions[classId];
        document.getElementById('prediction').innerText = `Predicted class ID: ${classId}, Confidence: ${confidence.toFixed(3)}`;
    } catch (error) {
        console.error("Error during prediction:", error);
    }
}

// Handle the file input change event (image upload)
document.getElementById('imageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function (e) {
        const image = new Image();
        image.src = e.target.result;

        image.onload = function () {
            // Create an image element to display the uploaded image
            const uploadedImage = document.createElement('img');
            uploadedImage.id = 'uploadedImage';
            uploadedImage.src = image.src;
            document.body.appendChild(uploadedImage);

            // Perform the prediction once the image is loaded
            predict();
        };
    };
    
    reader.readAsDataURL(file);
});

// Load the model when the page is ready
loadModel();
