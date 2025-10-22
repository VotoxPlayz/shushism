// script.js
// Set the initial position (Chapter 1, Page 1)
let currentChapterIndex = 0;
let currentPageIndex = 0;

// Helper function to get DOM elements
const $ = (selector) => document.querySelector(selector);

// --- Core Function: Update the Display ---
function updatePageContent() {
    const chapter = BOOK_DATA[currentChapterIndex];
    const pageContent = chapter.pages[currentPageIndex];

    // 1. Update Header Text
    $('#chapter-title').textContent = `Chapter ${currentChapterIndex + 1}: ${chapter.title}`;
    $('#page-id').textContent = `Page ${currentChapterIndex + 1}:${currentPageIndex + 1}`;

    // 2. Update Book Content (Use innerHTML because the content is an HTML string)
    $('#book-content').innerHTML = pageContent;

    // 3. Update Navigation Buttons state (Enable/Disable)
    const canGoBack = currentChapterIndex > 0 || currentPageIndex > 0;
    const canGoNext = currentChapterIndex < BOOK_DATA.length - 1 || currentPageIndex < chapter.pages.length - 1;

    // Use a utility function to apply/remove disabled styling/functionality
    toggleNavButton('prev', canGoBack);
    toggleNavButton('next', canGoNext);
}

function toggleNavButton(direction, isEnabled) {
    const selector = `[aria-label="${direction === 'prev' ? 'Previous' : 'Next'} Page"]`;
    const buttons = document.querySelectorAll(selector);

    buttons.forEach(button => {
        if (isEnabled) {
            button.removeAttribute('disabled');
            button.classList.remove('opacity-50', 'cursor-not-allowed', 'hover:bg-gray-700', 'hover:bg-gray-600');
            button.classList.add('hover:bg-indigo-500', 'bg-indigo-600', 'hover:bg-gray-700', 'bg-gray-700'); // Ensure hover effects are active
        } else {
            button.setAttribute('disabled', true);
            button.classList.add('opacity-50', 'cursor-not-allowed');
            button.classList.remove('hover:bg-indigo-500', 'bg-indigo-600', 'hover:bg-gray-700', 'bg-gray-700'); // Remove active hover effects
        }
    });
}

// --- Navigation Handler ---
function navigatePage(direction) {
    let nextChapterIndex = currentChapterIndex;
    let nextPageIndex = currentPageIndex;
    const currentChapter = BOOK_DATA[currentChapterIndex];

    if (direction === 'next') {
        if (nextPageIndex < currentChapter.pages.length - 1) {
            // Stay in current chapter, go to next page
            nextPageIndex++;
        } else if (nextChapterIndex < BOOK_DATA.length - 1) {
            // Go to next chapter, first page
            nextChapterIndex++;
            nextPageIndex = 0;
        } else {
            // Already at the end
            return;
        }
    } else if (direction === 'prev') {
        if (nextPageIndex > 0) {
            // Stay in current chapter, go to previous page
            nextPageIndex--;
        } else if (nextChapterIndex > 0) {
            // Go to previous chapter, last page
            nextChapterIndex--;
            nextPageIndex = BOOK_DATA[nextChapterIndex].pages.length - 1;
        } else {
            // Already at the beginning
            return;
        }
    }

    // Update global state and refresh the page
    currentChapterIndex = nextChapterIndex;
    currentPageIndex = nextPageIndex;
    updatePageContent();
}

// --- Event Listeners and Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Attach listeners to all navigation buttons
    document.querySelectorAll('[aria-label$="Page"]').forEach(button => {
        const direction = button.getAttribute('aria-label').includes('Next') ? 'next' : 'prev';
        button.addEventListener('click', () => navigatePage(direction));
    });

    // 2. Load the very first page
    updatePageContent();
});
