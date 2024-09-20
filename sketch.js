let fishImg;
let imgElement;

function setup() {
    // Hide the image element
    imgElement = document.getElementById('fish');
    imgElement.style.display = 'none';  // Hide the image element

    // Create the canvas with dimensions of the image
    let canvas = createCanvas(imgElement.width, imgElement.height);
    canvas.parent(imgElement.parentNode);  // Attach the canvas to the same parent as the image

    // Load the image into p5.js
    fishImg = loadImage(imgElement.src, () => {
        image(fishImg, 0, 0, width, height);
        distortImage();  // Apply distortion effect
    });

    noLoop();  // No continuous drawing, only when triggered

    loadCategory(currentCategoryIndex);
    document.getElementById('submitButton').addEventListener('click', checkAnswer);
    document.getElementById('restartButton').addEventListener('click', restartCategory);
}
    

function draw() {
  if (fishImg) {
      image(fishImg, 0, 0, width, height);
  }
}

function distortImage() {
  if (fishImg) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = round(x1 + random(-10, 10));
    let y2 = round(y1 + random(-10, 10));

    set(x2, y2, get(x1, y1, 30, 30));  // Distort a portion of the image
    updatePixels();  // Update the canvas with the changes
} // Update the canvas with the changes
}



//----------IMAGE--SELECTION------------
        const categories = [
            {
                title: 'Which one is human',
                images: [
                    'img/dog1.jpg', 'img/dog2.jpg', 'img/dog3.jpg',
                    'img/cat1.jpg', 'img/cat2.jpg', 'img/dog4.jpg',
                    'img/cat3.jpg', 'img/dog5.jpg', 'img/cat4.jpg'
                ],
                correctAnswer: new Set([0, 1, 2, 5, 7])
            },
            {
                title: 'Choose cat images',
                images: [
                    'img/cat1.jpg', 'img/cat2.jpg', 'img/cat3.jpg',
                    'img/dog1.jpg', 'img/dog2.jpg', 'img/dog3.jpg',
                    'img/dog4.jpg', 'img/dog5.jpg', 'img/cat5.jpg'
                ],
                correctAnswer: new Set([0, 1, 2, 8])
            },
            {
                title: 'Choose rat images',
                images: [
                    'img/cat4.jpg', 'img/rat2.jpg', 'img/dog3.jpg',
                    'img/rat1.jpg', 'img/dog1.jpg', 'img/rat3.jpg',
                    'img/rat4.jpg', 'img/cat5.jpg', 'img/dog4.jpg'
                ],
                correctAnswer: new Set([1, 3, 5, 6])
            }
        ];

        let currentCategoryIndex = 0;
        let selectedImages = new Set();

      /*  function setup() {
            loadCategory(currentCategoryIndex);
            document.getElementById('submitButton').addEventListener('click', checkAnswer);
            document.getElementById('restartButton').addEventListener('click', restartCategory);

    
        }*/

        function loadCategory(index) {
            const category = categories[index];
            let titleText = category.title;
            
            titleText = titleText.replace('human', '<span class="highlight">human</span>');
            titleText = titleText.replace('cat', '<span class="highlight">cat</span>');
            titleText = titleText.replace('rat', '<span class="highlight">rat</span>');

            document.getElementById('captchaTitle').innerHTML = titleText;

            const container = document.getElementById('captcha-container');
            container.innerHTML = ''; // Clear existing images
            
            category.images.forEach((path, imgIndex) => {
                const div = document.createElement('div');
                div.classList.add('image-cell');
                div.dataset.index = imgIndex;
                
                const img = document.createElement('img');
                img.src = path;
                
                div.appendChild(img);
                container.appendChild(div);

                div.addEventListener('click', () => toggleSelection(div));
            });

            selectedImages.clear(); // Clear selected images for the new category
            document.getElementById('resultMessage').innerText = ''; // Clear result message
            document.getElementById('restartButton').style.display = 'none'; // Hide restart button
        }

        function toggleSelection(cell) {
        const index = cell.dataset.index;

            if (selectedImages.has(index)) {
                selectedImages.delete(index);
                cell.classList.remove('selected');
            } else {
                selectedImages.add(index);
                cell.classList.add('selected');
            }
        }

        function checkAnswer() {
            const category = categories[currentCategoryIndex];
            const cells = document.querySelectorAll('.image-cell');

            // Convert selectedImages to number to match correctAnswer
            const selectedNumbers = new Set([...selectedImages].map(Number));

            // Reset all cells to avoid stale state
            cells.forEach(cell => {
                cell.classList.remove('correct', 'incorrect');
            });

            // Mark correct and incorrect cells
            cells.forEach(cell => {
                const index = Number(cell.dataset.index);
                if (category.correctAnswer.has(index)) {
                    cell.classList.add('correct');
                } else {
                    cell.classList.add('incorrect');
                }
            });

            // Check if the selected images match the correct answer
            if (JSON.stringify([...selectedNumbers].sort()) === JSON.stringify([...category.correctAnswer].sort())) {
                document.getElementById('resultMessage').innerText = 'Correct! Well done.';
                document.getElementById('resultMessage').style.color = 'green';

                // Move to the next category after a delay
                currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
                setTimeout(() => loadCategory(currentCategoryIndex), 2000); // Load next category after a delay
            } else {
                document.getElementById('resultMessage').innerText = 'Try again!';
                document.getElementById('resultMessage').style.color = 'red';

                // Show the restart button
                document.getElementById('restartButton').style.display = 'inline-block';
            }
        }

        function restartCategory() {
            loadCategory(currentCategoryIndex);
        }

        setup();

