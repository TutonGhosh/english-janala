const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((resp) => resp.json())
    .then((json) => displayLessons(json.data));
};

const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((resp) => resp.json())
    .then((json) => displayLevelWord(json.data));
};

const displayLevelWord = (words) => {

    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";

    if(words.length == 0){
        cardContainer.innerHTML = `
        <div class="text-center col-span-full space-y-3">
                    <img class="mx-auto" src="assets/alert-error.png" alt="">
                    <h1 class="text-sm font-thin font-bangla">এই Lesson-এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</h1>
                    <h1 class="text-2xl font-semibold">অনুগ্রহ করে নেক্সট Lesson-এ যান।</h1>
                </div>
        `;
    }

    words.forEach((word) => {
        const cardDiv = document.createElement("div");
        cardDiv.innerHTML = `
        <div id="card" class="bg-white rounded-xl py-10 px-5 text-center">
                    <h1 class="mb-3 text-xl font-semibold">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h1>
                    <p class="mb-5 text-xs font-normal">Meaning / Pronounciation</p>
                    <div>
                        <h1 class="text-xl font-bangla font-semibold">"${word.meaning ? word.meaning : "শব্দার্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</h1>
                    </div>
                    <div class="flex justify-between mt-5">
                        <button class="btn bg-blue-50 hover:bg-blue-100"><i class="fa-solid fa-circle-info text-gray-600"></i></button>
                        <button class="btn bg-blue-50 hover:bg-blue-100"><i class="fa-solid fa-volume-high text-gray-600"></i></button>
                    </div>
                </div>
        `;

        cardContainer.appendChild(cardDiv);

        console.log(word);
    })
}

displayLessons = (lessons) => {
  const lessonsContainer = document.getElementById("lessons-container");
  lessonsContainer.innerHTML = "";

  lessons.forEach((lesson) => {
    const btnLesson = document.createElement("button");
    btnLesson.innerHTML = `
        <button onclick = "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary">
        <i class="fa-solid fa-book-open"></i>Lesson ${lesson.level_no}
        </button>
        `;

    lessonsContainer.appendChild(btnLesson);
  });
};

loadLessons();

