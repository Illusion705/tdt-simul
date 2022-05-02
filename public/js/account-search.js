// loading animation
const loadingAnimation = new LoadingAnimation($("#loading-animation"), 50, 5);
loadingAnimation.start();

// fetch user data
fetch("/api/")