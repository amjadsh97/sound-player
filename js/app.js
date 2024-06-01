document.addEventListener("DOMContentLoaded", () => {
	// Elements
	const nextButton = document.querySelector("#next_btn");
	const prevButton = document.querySelector("#prev_btn");
	const playButton = document.querySelector("#run_button");
	const playerElement = document.querySelector("#player_element");
	const currentDuration = document.querySelector("#current_duration");
	const leftDuration = document.querySelector("#left_duration");
	const progressBar = document.querySelector(".line");
	const innerProgressBar = document.querySelector(".inner-line");
	const coverImage = document.querySelector("#cover_image");
	const songName = document.querySelector("#song_name");
	const songDescription = document.querySelector("#song_description");

	// Variables
	let currentIndex = 0;
	let isPlaying = false;
	const songs = [
		{name: "song 1", description: "description 1", src: "assets/forest-lullaby.mp3", img: "assets/cover-1.png"},
		{name: "song 2", description: "description 2", src: "assets/lost-in-city.mp3", img: "assets/cover-2.png"}
	];
	let updateTimeFrame;

	// Initialize durations to 0:00
	currentDuration.innerHTML = "0:00";
	leftDuration.innerHTML = "0:00";

	// Load the first song and update durations when metadata is loaded
	loadSong();

	// Event listeners
	playButton.addEventListener("click", handlePlayButtonClick);
	playerElement.addEventListener("playing", handlePlaying);
	playerElement.addEventListener("pause", handlePause);
	nextButton.addEventListener("click", handleNextButtonClick);
	prevButton.addEventListener("click", handlePrevButtonClick);
	progressBar.addEventListener("click", handleSeek);

	function handlePlayButtonClick() {
		if (playerElement.src === "") {
			loadAndPlaySong();
		} else {
			togglePlayPause();
		}
	}

	function handlePlaying() {
		isPlaying = true;
		playButton.classList.add("playing");
		startUpdatingTime();
	}

	function handlePause() {
		isPlaying = false;
		playButton.classList.remove("playing");
		cancelAnimationFrame(updateTimeFrame);
	}

	function handleNextButtonClick() {
		if (currentIndex < songs.length - 1) {
			currentIndex++;
			loadAndPlaySong();
		}
	}

	function handlePrevButtonClick() {
		if (currentIndex > 0) {
			currentIndex--;
			loadAndPlaySong();
		}
	}

	function startUpdatingTime() {
		updateProgressBar();
		updateDurations();
		updateTimeFrame = requestAnimationFrame(startUpdatingTime);
	}

	function updateDurations() {
		updateCurrentTime();
		updateRemainingTime();
	}

	function updateCurrentTime() {
		const minutes = Math.floor(playerElement.currentTime / 60);
		const seconds = Math.floor(playerElement.currentTime % 60);
		currentDuration.innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	}

	function updateRemainingTime() {
		if (!isNaN(playerElement.duration)) {
			const remainingTime = playerElement.duration - playerElement.currentTime;
			const minutes = Math.floor(remainingTime / 60);
			const seconds = Math.floor(remainingTime % 60);
			leftDuration.innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		} else {
			leftDuration.innerHTML = "0:00";
		}
	}

	function updateInitialDurations() {
		const remainingTime = playerElement.duration;
		const minutes = Math.floor(remainingTime / 60);
		const seconds = Math.floor(remainingTime % 60);
		leftDuration.innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	}

	function togglePlayPause() {
		if (isPlaying) {
			playerElement.pause();
		} else {
			playerElement.play();
		}
	}

	function loadAndPlaySong() {
		playerElement.src = songs[currentIndex].src;
		coverImage.src = songs[currentIndex].img;
		songName.innerHTML = songs[currentIndex].name;
		songDescription.innerHTML = songs[currentIndex].description;
		playerElement.play();
	}

	function loadSong() {
		playerElement.src = songs[currentIndex].src;
		coverImage.src = songs[currentIndex].img;
		songName.innerHTML = songs[currentIndex].name;
		songDescription.innerHTML = songs[currentIndex].description;
		playerElement.addEventListener("loadedmetadata", updateInitialDurations);
	}

	function updateProgressBar() {
		const progress = (playerElement.currentTime / playerElement.duration) * 100;
		innerProgressBar.style.width = `${progress}%`;
	}

	function handleSeek(event) {
		const rect = progressBar.getBoundingClientRect();
		const offsetX = event.clientX - rect.left;
		const width = rect.width;
		const newTime = (offsetX / width) * playerElement.duration;
		playerElement.currentTime = newTime;
	}
});
