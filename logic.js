<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    <script>
        let model;

        // Load the pre-trained model
        async function loadModel() {
            model = await tf.loadLayersModel('https://storage.googleapis.com/tm-models/your_model_url/model.json');  // Replace with your model URL
            console.log("Model loaded!");
        }

        // Preprocess the image to fit the model input
        function preprocessImage(imageElement) {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;
            ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

            // Resize the image to match the model's input size (e.g., 224x224)
            return tf.browser.fromPixels(canvas).resizeBilinear([224, 224]).toFloat().div(tf.scalar(255)).expandDims(0);
        }

        // Predict the class of the uploaded image
        async function predict() {
            const imageElement = document.getElementById('uploadedImage');
            const tensor = preprocessImage(imageElement);
            const predictions = await model.predict(tensor).data();

            // Output the result
            const classId = predictions.indexOf(Math.max(...predictions));
            const confidence = predictions[classId];
            document.getElementById('prediction').innerText = `Predicted class ID: ${classId}, Confidence: ${confidence.toFixed(3)}`;
        }

        // Handle the file input change (image upload)
        document.getElementById('imageUpload').addEventListener('change', async function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const image = new Image();
                image.src = e.target.result;
                image.onload = function () {
                    // Create an image element to be used for prediction
                    const uploadedImage = document.createElement('img');
                    uploadedImage.id = 'uploadedImage';
                    uploadedImage.src = image.src;
                    document.body.appendChild(uploadedImage);
                    
                    // Call the predict function once the image is loaded
                    predict();
                }
            };
            reader.readAsDataURL(file);
        });

        // Load the model when the page loads
        loadModel();
    </script>
