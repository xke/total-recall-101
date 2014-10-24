Total Recall 101
================

A first step to zero-effort alerts on product recalls.


Installation Instructions
=========================

1. Go to <a href="http://www.google.com/script/start/" target="_blank">http://www.google.com/script/start/</a> and click "Start Scripting" to create a new blank project.

2. Sign into your Gmail account and visit <a href="https://script.google.com/d/1FFgmhq4ZkiweXINSwXv-5_0S6OEu72Ii3DCIZ7DduYdEBNqG1KwP-1dA/edit?usp=sharing" target="_blank">Total Recall 101</a> to view the project code.

3. Copy and paste the "Total Recall 101" code into your new blank project. You may rename your blank project (e.g. to "My Total Recall 101").

4. In your project, go to "Run" > "totalRecall" on the toolbar. Provide the app script with authorization to run.

	The requested set of permissions allows the app to search your email archive with the latest recall information and send you alert emails that help you know about relevant recalls. All your email information remains private to you.

5. Wait for the script to finish running and then check your Gmail inbox. You should have received a Total Recall email! If you encounter issues, you can email me at <a href="mailto:xke@alum.mit.edu">xke@alum.mit.edu</a>.

6. You can set the script to run every day or every week using "Resources" > "Current project's triggers" on the toolbar. The script saves information on the date of the last run, and will only show recalls issued since this last-run date.



Background and Motivation
=========================

Life gets busy. We should get recall alerts on products we use with zero extra effort.

In practice, no one place knows about all the products we use. We buy products from different retailers, both online and offline. Most of us don't have a habit of creating and updating a list of every product we own.

Our email archives may be the single most comprehensive source of information on our shopping history. We tend to keep the same email address(es) for many years. Online stores automatically send receipts to our email inbox. Offline stores have started to offer email receipts as an option too. Our email conversations with friends may also reference products we own.

Technology that can automatically review our email archives and alert us to recalls on products found in those archives would bring us closer to a world of zero-effort recall alerts. This submission, code named "Total Recall 101," is a working prototype that shows how current technology can positively impact the hundreds of millions of people who use email. According to <a href="https://gigaom.com/2012/10/31/gmail-finally-beats-hotmail-according-to-third-party-data-chart/" target="_blank">ComScore</a>, over 95% of Americans with email access use one of three email services: Yahoo, Gmail, and Hotmail. For demonstration purposes, "Total Recall 101" makes use of the U.S. Consumer Product Safety Commission's <a href="http://www.cpsc.gov/en/Recalls/CPSC-Recalls-Application-Program-Interface-API-Information/" target="_blank">Recalls API</a>, <a href="https://developers.google.com/apps-script/" target="_blank">Google Apps Script</a> and Gmail search to create a functional app that users can install in minutes using a web browser. The app generates alert emails that can then be read from any device, including mobile devices.

More information: http://productsafetyapps.challengepost.com/submissions/23883-total-recall-101




