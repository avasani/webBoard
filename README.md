## Project Name: WebBoard-An Online Interactive Tutoring System ##

## Group Members: ##
* ASHWIN VASANI (akvasani@asu.edu)
* RAVINSINGH JAIN (rvjain@asu.edu)
* SAGAR KALBURGI (skalburg@asu.edu)

## Mentor: ##
HUIJUN WU (Huijun.Wu@asu.edu)

## Abstract - ##

This project is to meet the necessary requirements of online lectures and to make it easier for the 
instructors and the students to communicate more effectively and interactively, especially for remote students. 
WebBoard is an integrated tutoring application. During the presentation, the instructor can has an application 
interface called WebBoard, the content of which is replicated to all the students in their respective WebBoards. 
It comes with a Canvas to show presentation slides, White board that allows instructors to write on it and Virtual 
machine to demonstrate live coding to students. The instructor can easily switch among the Slides, Virtual machine
and the White board. While elaborating on the concepts, the instructor can annotate the content of slides, without 
modifying them which makes it easier for students to understand the concepts.

Keywords -- webRTC, Vlab, Node.js, Video conferencing, Screen sharing, WebBoard,
	 tutoring, VP8


## Downloads: ##
Project Proposal:

http://mobisphere.asu.edu/classta/webboard/raw/master/CSE591_WebBoard_ProjectProposal_RSA.docx
http://mobisphere.asu.edu/classta/webboard/raw/master/CSE591_WebBoard_ProjectProposal_RSA.pdf

PowerPoint Presentation:
http://mobisphere.asu.edu/classta/webboard/raw/master/CSE591_Project_WebBoard_Ashwin_Ravin_Sagar.ppt

Midterm Progress Report:

http://mobisphere.asu.edu/classta/webboard/blob/master/CSE591_WebBoard_Midterm_ProjectReport_RSA_Group.docx
http://mobisphere.asu.edu/classta/webboard/blob/master/CSE591_WebBoard_Midterm_ProjectReport_RSA_Group.pdf
http://mobisphere.asu.edu/classta/webboard/blob/master/CSE591_MidtermProjectReport_RSA_Group.ppt

Project Report-Final Version:

http://mobisphere.asu.edu/classta/webboard/raw/master/CSE591_WebBoard_Final_ProjectReport_RSA_Group.docx
http://mobisphere.asu.edu/classta/webboard/raw/master/CSE591_WebBoard_Final_ProjectReport_RSA_Group.pdf
http://mobisphere.asu.edu/classta/webboard/raw/master/CSE591_Project_FinalReport_Ashwin_Ravin_Sagar_Final.ppt

Note: Test report is present in the final project report

## WebBoard: ##
This module is the base module of the final application.
It includes bootstrap for css, uses GhostScript and spindrift module for converting pdf to
images,uses formidable for uploading the pdf to the server, uses jquery for dynamic changing
of grids and uses passport module for authentication of user during login and redirects to
either the student or instructor page.

First you need to register yourself using the 'Register' button on the login form. Once you
are done, you can login using your credentials.

## To run this application on the local machine for first time, do the following. ##
<pre>
   $ cd WebBoard

   $ sudo apt-get install npm nodejs-dev

   $ npm install

   $ npm install connect formidable spindrift pdfkit passport passport-local pdfutils mongodb \
   password-hash util mkpath easyimage multiparty --save fs-extra express-session cookie-parser body-parser

   $ apt-get install imagemagick

</pre>
## Execution: ##
<pre>
   $ nodejs index.js
</pre>
Open the application with the path as 127.0.0.1:3000

## References: ##
<pre>
How To Connect Node.js to a MongoDB Database on a VPS
https://www.digitalocean.com/community/tutorials/how-to-connect-node-js-to-a-mongodb-database-on-a-vps
 
Implementing password hashing
https://www.npmjs.org/package/password-hash
</pre>