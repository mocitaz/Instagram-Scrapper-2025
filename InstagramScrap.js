const https = require('https');
const fs = require('fs');

const usernames = [
    '@username1', '@username2' // Replace with actual usernames you want to scrape
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchUserProfile = (username, callback) => {
  const profileOptions = {
    hostname: 'i.instagram.com',
    path: `/api/v1/users/web_profile_info/?username=${username}`,
    headers: {
      'User-Agent': 'iphone_ua',
      'x-ig-app-id': '***************', // Masked IG App ID
      'Cookie': 'ig_did=********-****-****-****-************; datr=*************; ps_l=1; ps_n=1; mid=******; csrftoken=******; ds_user_id=****; sessionid=********; rur=****; wd=295x864',
      'X-CSRFToken': '******',
    },
  };

  https.get(profileOptions, (res) => {
    let data = '';
    console.log(`Profile Status Code for ${username}:`, res.statusCode);

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);

        if (res.statusCode === 401) {
          console.error(`Unauthorized (Profile) for ${username}: Check your cookies or authentication.`);
          callback(null);
          return;
        }
        if (res.statusCode === 429) {
          console.error(`Rate-limited (Profile) for ${username}: Please wait a few minutes and try again.`);
          callback(null);
          return;
        }

        if (!jsonData.data || !jsonData.data.user) {
          console.error(`Invalid response structure or user not found for ${username}:`, jsonData);
          callback(null);
          return;
        }

        callback(jsonData.data.user);
      } catch (error) {
        console.error(`Error parsing JSON (Profile) for ${username}:`, error.message);
        callback(null);
      }
    });
  }).on('error', (error) => {
    console.error(`Error making request (Profile) for ${username}:`, error.message);
    callback(null);
  });
};

const fetchUserMedia = (user, username, callback) => {
  if (!user) {
    callback(null);
    return;
  }

  const userId = user.id;
  const mediaOptions = {
    hostname: 'i.instagram.com',
    path: `/api/v1/feed/user/${userId}/?count=12`, // Fetch 12 most recent posts
    headers: {
      'User-Agent': 'iphone_ua',
      'x-ig-app-id': '***************', // Masked IG App ID
      'Cookie': 'ig_did=********-****-****-****-************; datr=*************; ps_l=1; ps_n=1; mid=******; csrftoken=******; ds_user_id=****; sessionid=********; rur=****; wd=295x864',
      'X-CSRFToken': '******',
    },
  };

  https.get(mediaOptions, (res) => {
    let data = '';
    console.log(`Media Status Code for ${username}:`, res.statusCode);

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);

        if (res.statusCode === 401) {
          console.error(`Unauthorized (Media) for ${username}: Check your cookies or authentication.`);
          callback(null);
          return;
        }
        if (res.statusCode === 429) {
          console.error(`Rate-limited (Media) for ${username}: Please wait a few minutes and try again.`);
          callback(null);
          return;
        }

        const timeline_media = jsonData.items || [];

        let averageLikes = 'Not Available';
        let averageComments = 'Not Available';
        let engagementRate = 'Not Available';

        if (timeline_media.length > 0) {
          const likeCounts = timeline_media.map(item => item.like_count || 0);
          const commentCounts = timeline_media.map(item => item.comment_count || 0);

          averageLikes = likeCounts.reduce((sum, count) => sum + count, 0) / timeline_media.length;
          averageComments = commentCounts.reduce((sum, count) => sum + count, 0) / timeline_media.length;
          engagementRate = ((averageLikes + averageComments) / user.edge_followed_by.count) * 100;
        }

        const accountInfo = {
          Username: user.username,
          'Full Name': user.full_name || 'Not Available',
          Biography: user.biography || 'Not Available',
          Country: user.country_block || 'Not Available',
          Url: `https://www.instagram.com/${user.username}`,
          Category: user.category_name || 'Not Available',
          Followers: user.edge_followed_by.count,
          Following: user.edge_follow.count,
          Posts: user.edge_owner_to_timeline_media.count,
          'Is Verified': user.is_verified ? 'Yes' : 'No',
          'Is Professional Account': user.is_business_account ? 'Yes' : 'No',
          'Average Likes': averageLikes.toFixed(2),
          'Average Comments': averageComments.toFixed(2),
          'Engagement Rate': engagementRate.toFixed(2) + '%',
        };

        callback(accountInfo);
      } catch (error) {
        console.error(`Error parsing JSON (Media) for ${username}:`, error.message);
        callback(null);
      }
    });
  }).on('error', (error) => {
    console.error(`Error making request (Media) for ${username}:`, error.message);
    callback(null);
  });
};

const saveToJSON = (allAccounts) => {
  const jsonFile = 'instagram_user_data_latest.json';
  fs.writeFileSync(jsonFile, JSON.stringify(allAccounts, null, 2), 'utf8');
  console.log(`Data saved to ${jsonFile}`);
};

const scrapeAccounts = async () => {
  console.log('Starting scraping process...');
  const allAccounts = [];

  for (const username of usernames) {
    console.log(`Scraping ${username}...`);
    await new Promise((resolve) => {
      fetchUserProfile(username, (user) => {
        if (!user) {
          console.log(`Skipping ${username} due to error or no data.`);
          allAccounts.push({
            Username: username,
            'Full Name': 'Not Available',
            Biography: 'Not Available',
            Country: 'Not Available',
            Url: `https://www.instagram.com/${username}`,
            Category: 'Not Available',
            Followers: 'Not Available',
            Following: 'Not Available',
            Posts: 'Not Available',
            'Is Verified': 'Not Available',
            'Is Professional Account': 'Not Available',
            'Average Likes': 'Not Available',
            'Average Comments': 'Not Available',
            'Engagement Rate': 'Not Available',
          });
          resolve();
          return;
        }

        fetchUserMedia(user, username, (accountInfo) => {
          if (accountInfo) {
            console.log(`Adding data for ${username} to results:`);
            console.log(JSON.stringify(accountInfo, null, 2));
            allAccounts.push(accountInfo);
          } else {
            console.log(`No data saved for ${username}.`);
            allAccounts.push({
              Username: username,
              'Full Name': 'Not Available',
              Biography: 'Not Available',
              Country: 'Not Available',
              Url: `https://www.instagram.com/${username}`,
              Category: 'Not Available',
              Followers: 'Not Available',
              Following: 'Not Available',
              Posts: 'Not Available',
              'Is Verified': 'Not Available',
              'Is Professional Account': 'Not Available',
              'Average Likes': 'Not Available',
              'Average Comments': 'Not Available',
              'Engagement Rate': 'Not Available',
            });
          }
          resolve();
        });
      });
    });
    await delay(2000); // Delay 2 seconds between accounts
  }

  // Log account order before saving to JSON
  console.log('Final order of accounts in JSON:');
  allAccounts.forEach((account, index) => {
    console.log(`${index + 1}. ${account.Username}`);
  });

  saveToJSON(allAccounts);
  console.log('Scraping completed.');
};

scrapeAccounts();
