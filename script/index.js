const createElement = (arr) => {
    const htmlElement = arr.map(el => `<span class="btn text-xs bg-blue-50 hover:bg-blue-100">${el}</span>`);
    return htmlElement.join(" ");
}

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("card-container").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("card-container").classList.remove("hidden");
  }
};

const pronounceWord = (word) => {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((resp) => resp.json())
    .then((json) => displayLessons(json.data));
};

const removeActiveLesson = () => {
    const lessonBtn = document.querySelectorAll(".lesson-btn");
    console.log(lessonBtn)
    lessonBtn.forEach((btn) => {
        btn.classList.remove("active-lesson");
    })
}

const loadLevelWord = (id) => {

    manageSpinner(true);

    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((resp) => resp.json())
    .then((json) => {
        removeActiveLesson();
        const lessonBtn = document.getElementById(`lesson-btn-${id}`);
        lessonBtn.classList.add("active-lesson")
        displayLevelWord(json.data)
    });
};

const loadWordDetail = async(id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const resp = await fetch(url);
    const json = await resp.json();
    displayWordDetail(json.data);
}


// "status": true,
// "message": "successfully fetched a word details",
// "data": {
// "word": "Eager",
// "meaning": "আগ্রহী",
// "pronunciation": "ইগার",
// "level": 1,
// "sentence": "The kids were eager to open their gifts.",
// "points": 1,
// "partsOfSpeech": "adjective",
// "synonyms": [
// "enthusiastic",
// "excited",
// "keen"
// ],
// "id": 5
// }

const displayWordDetail = (word) => {
    console.log(word);
    const wordDetail = document.getElementById("word-detail");
    wordDetail.innerHTML = `
    <div class="text-2xl font-bold">
                            <h1>${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation} )</h1>
                        </div>
                        <div class="space-y-1">
                            <h1 class="text-xs font-semibold">Meaning</h1>
                            <p class="text-sm font-bangla">${word.meaning}</p>
                        </div>
                        <div class="space-y-1">
                            <h1 class="text-xs font-semibold">Example</h1>
                            <p class="text-sm">${word.sentence}</p>
                        </div>
                        <div class="space-y-2">
                            <h1 class="text-xs font-semibold">Synonyms</h1>
                            <div class="flex flex-wrap gap-1">${createElement(word.synonyms)}</div>
                        </div>
    `;
    document.getElementById("word_modal").showModal();
}

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
        manageSpinner(false);
        return;
    }

    words.forEach((word) => {
        const cardDiv = document.createElement("div");
        cardDiv.innerHTML = `
        <div id="card" class="bg-white rounded-xl py-10 px-5 text-center h-full">
                    <h1 class="mb-3 text-xl font-semibold">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h1>
                    <p class="mb-5 text-xs font-normal">Meaning / Pronounciation</p>
                    <div>
                        <h1 class="text-xl font-bangla font-semibold">"${word.meaning ? word.meaning : "শব্দার্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</h1>
                    </div>
                    <div class="flex justify-between mt-5">
                        <button onclick = "loadWordDetail(${word.id})" class="btn bg-blue-50 hover:bg-blue-100"><i class="fa-solid fa-circle-info text-gray-600"></i></button>
                        <button onclick="pronounceWord('${word.word}')" class="btn bg-blue-50 hover:bg-blue-100"><i class="fa-solid fa-volume-high text-gray-600"></i></button>
                    </div>
                </div>
        `;
        cardContainer.appendChild(cardDiv);
    })
    manageSpinner(false);
}

const displayLessons = (lessons) => {
  const lessonsContainer = document.getElementById("lessons-container");
  lessonsContainer.innerHTML = "";

  lessons.forEach((lesson) => {
    const btnLesson = document.createElement("div");
    btnLesson.innerHTML = `
        <button id = "lesson-btn-${lesson.level_no}" onclick = "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i>Lesson ${lesson.level_no}
        </button>
        `;

    lessonsContainer.appendChild(btnLesson);
  });
};

document.getElementById("searchBtn").addEventListener("click", () => {
  const searchInput = document.getElementById("input-value");
  const searchValue = searchInput.value.trim().toLowerCase();
  console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((resp) => resp.json())
    .then((json) => {
      const allWords = json.data;
      console.log(allWords);

      const filterWords = allWords.filter((data) => data.word.toLowerCase().includes(searchValue));
      displayLevelWord(filterWords);
    });
});

loadLessons();

