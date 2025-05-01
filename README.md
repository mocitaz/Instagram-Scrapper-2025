# 📸 Instagram Scraper

Welcome to the **Instagram Scraper**! This tool allows you to scrape Instagram user profiles and their media data, such as average likes, comments, and engagement rates. The scraped results are saved in a JSON file for easy access and further analysis.

---

## 🛠️ Requirements

To run this project, you will need:

- **Node.js** (v12 or higher) 🚀
- **NPM** (Node Package Manager) 📦

---

## 🔧 Setup & Installation

Follow these steps to set up the scraper on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mocitaz/Instagram-Scraper.git
   cd Instagram-Scraper
   ```

2. **Install dependencies:**
   Run the following command to install all required dependencies:
   ```bash
   npm install
   ```

3. **Configure the Usernames:**
   In the script (`scraper.js`), modify the `usernames` array to include the Instagram usernames you want to scrape:
   ```javascript
   const usernames = ['@username1', '@username2', '@username3'];
   ```

4. **Get Instagram API Credentials:**
   To make requests to Instagram, you need valid credentials: `x-ig-app-id`, `Cookie`, and `X-CSRFToken`. Here's how to get them:

   - Open Instagram in your browser (preferably Google Chrome).
   - Log in to your Instagram account.
   - Open Developer Tools (Right-click on the page → "Inspect" → "Network" tab).
   - Refresh the Instagram page.
   - In the Network tab, search for any request with the URL pattern like:
     ```
     https://i.instagram.com/api/v1/users/web_profile_info/
     ```
   - Click on the request and look at the **Headers** section.
   - Extract the following information:
     - **x-ig-app-id**: Look for the `x-ig-app-id` header.
     - **Cookie**: Look for the `Cookie` header. It includes session-related cookies like `ig_did`, `mid`, `csrftoken`, etc.
     - **X-CSRFToken**: Look for the `X-CSRFToken` header.

   - Once you have this information, replace the placeholders in the script with your credentials:
     ```javascript
     'User-Agent': 'iphone_ua',
     'x-ig-app-id': 'YOUR_APP_ID', // Masked IG App ID
     'Cookie': 'YOUR_COOKIE', // Your cookies here
     'X-CSRFToken': 'YOUR_CSRF_TOKEN' // Your CSRF token here
     ```

   💡 **Note**: These credentials are required to authenticate your requests. They act as your "login" session and allow the scraper to fetch data from Instagram.

5. **Run the Scraper:**
   After configuring the script with your Instagram credentials, run the scraper with:
   ```bash
   node scraper.js
   ```

6. **Output:**
   Once the scraper has run, the results will be saved in a file called `instagram_user_data_latest.json`. This file will contain the following profile information:
   - Username
   - Full Name
   - Biography
   - Country (if available)
   - Followers count
   - Following count
   - Posts count
   - Is Verified ✅
   - Is Professional Account 💼
   - Average Likes 👍
   - Average Comments 💬
   - Engagement Rate 📊

---

## 📄 Disclaimer

Please use this tool responsibly and in compliance with Instagram's Terms of Service. The scraping of data should respect privacy and abide by legal regulations. Use of the app for any commercial purpose may violate Instagram's policies. 🚨

---

## 🚀 Quick Recap of the Features

- **Profile Information**: Scrape username, full name, biography, country, followers, following, posts, and more! 🧑‍💻
- **Media Data**: Gather statistics on average likes, average comments, and engagement rate for Instagram posts 📸
- **Easy Setup**: Just update your credentials and run the scraper! 🎉
- **Results in JSON**: Data is saved in a neat JSON format for easy analysis. 💾

---

## ✨ How It Works

1. **Collect Data**: The scraper fetches data like followers, following, and engagement metrics from Instagram profiles.
2. **Analyze Media**: It calculates average likes, comments, and engagement rates for the user’s posts.
3. **Save Results**: Everything is saved in a JSON file for your convenience.

---


## 💬 Feedback & Issues

If you encounter any issues or have feedback, feel free to open an issue or ask questions in the repository’s **Issues** tab. Let us know how we can improve! 😊

---

## 📧 Contact

If you have any further questions, feel free to reach out to me at:

**Email**: luthfafiwork@gmail.com

---

Happy scraping! 🎉

Thank you for using the Instagram Scraper! 🙌
