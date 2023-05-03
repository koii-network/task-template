const autoScroll = async (page) => {
    await page.evaluate(async () => {
        const distance = Math.floor(Math.random() * (450 - 100 + 1) + 100); // generate a random scroll amount between 100 and 450 pixels
        const interval = Math.floor(Math.random() * (2970 - 1030 + 1) + 1030) / 1000; // generate a random interval between 1.03 and 2.97 seconds
        await new Promise((resolve, reject) => {
        let totalHeight = 0;
        let timer = setInterval(() => {
            let scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
            }
        }, interval * 1000);
    });
});
};

module.exports = autoScroll;