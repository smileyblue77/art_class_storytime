function generateProtocol(child, pastSessions) {
    /*
     * Generate the protocol for this study.
     *
     * @param {Object} child
     *    The child currently participating in this study. Includes fields:
     *      givenName (string)
     *      birthday (Date)
     *      gender (string, 'm' / 'f' / 'o')
     *      ageAtBirth (string, e.g. '25 weeks'. One of '40 or more weeks',
     *          '39 weeks' through '24 weeks', 'Under 24 weeks', or
     *          'Not sure or prefer not to answer')
     *      additionalInformation (string)
     *      languageList (string) space-separated list of languages child is
     *          exposed to (2-letter codes)
     *      conditionList (string) space-separated list of conditions/characteristics
     *          of child from registration form, as used in criteria expression
     *          - e.g. "autism_spectrum_disorder deaf multiple_birth"
     *
     *      Use child.get to access these fields: e.g., child.get('givenName') returns
     *      the child's given name.
     *
     * @param {!Array<Object>} pastSessions
     *     List of past sessions for this child and this study, in reverse time order:
     *     pastSessions[0] is THIS session, pastSessions[1] the previous session,
     *     back to pastSessions[pastSessions.length - 1] which has the very first
     *     session.
     *
     *     Each session has the following fields, corresponding to values available
     *     in Lookit:
     *
     *     createdOn (Date)
     *     conditions
     *     expData
     *     sequence
     *     completed
     *     globalEventTimings
     *     completedConsentFrame (note - this list will include even "responses")
     *          where the user did not complete the consent form!
     *     demographicSnapshot
     *     isPreview
     *
     * @return {Object} Protocol specification for Lookit study; object with 'frames'
     *    and 'sequence' keys.
     */

    // -------- Helper functions ----------------------------------------------

    // See http://stackoverflow.com/a/12646864
    // Returns a new array with elements of the array in random order.
    function shuffle(array) {
        var shuffled = Ember.$.extend(true, [], array); // deep copy array
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * i);
            var temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
        return shuffled;
    }

    // Returns first element of an array, and does not remove that element from the array
    function pop_first(array) {
        if (array.length) {
            return array[0];
        }
        return null;
    }


    // Returns random int
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    // Returns random A or B
    function getRandomVersion() {
        let number = getRandomInt(100) % 2;
        if (number == 1) {
            return "A";
        } else {
            return "B";
        }
    }

    // Returns opposite condition
    function getOppositeVersion(char) {
        if (char == "A") {
            return "B";
        } else {
            return "A";
        }
    }

    // Returns a random element of an array, and removes that element from the array
    function pop_random(array) {
        var randIndex = Math.floor(Math.random() * array.length);
        if (array.length) {
            return array.pop(randIndex);
        }
        return null;
    }
    //Selects adult-only consent when child is over 16
    let one_day = 1000 * 60 * 60 * 24; // ms in one day
    let child_age_in_days = -1;
    try {
        child_age_in_days = (new Date() - child.get('birthday')) / one_day;
    } catch (error) {
        // Display what the error was for debugging, but continue with fake
        // age in case we can't calculate age for some reason
        console.error(error);
    }
    child_age_in_days = child_age_in_days || -1; // If undefined/null, set to default
        if (child_age_in_days >= 6570){
            prompt_only_adults = true;
        } else {
            prompt_only_adults = false;
        }

    // -------- End helper functions -------------------------------------------

    // Define common (non-test-trial) frames
    let frames = {
        ///////////////////////////////////////////////////////
        // WHERE WE YOU WILL ADD YOUR FRAMES FROM CONFIGURATION
        ///////////////////////////////////////////////////////
        "video-config": {
            "kind": "exp-video-config",
            "troubleshootingIntro": ""
        },
        "rest": {
            "kind": "exp-lookit-images-audio",
            "images": [{
                "id": "pencils",
                "src": "button_pencils.jpg",
                "top": 10,
                "left": 30,
                "width": 40
            }],
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "autoProceed": true,
            "durationSeconds": 10,
            "doRecording": false,
            "endSessionRecording": true,
            "showPreviousButton": false,
            "parentTextBlock": {
                "text": "Good job! It's time for a short break.",
                "title": "Pause anytime by pressing the space bar."
            }
        },
        "story1-title": {
            "kind": "exp-lookit-images-audio",
            "audio": "story1_intro",
            "images": [{
                "id": "fingerpaint",
                "src": "button_fingerpaint.jpg",
                "position": "center"
                
                
                }],
            "text": "Story 1 of 4",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "autoProceed": false,
            "showPreviousButton": false,
            "parentTextBlock": {
                "text": "Your child will now listen to the first of four stories. There will be a break after each story. You may pause anytime by pressing the space bar.",
                "title": "For parents:"
            }
        },
        "story2-title": {
            "kind": "exp-lookit-images-audio",
            "audio": "story2_intro",
            "images": [{
                "id": "fingerpaint",
                "src": "button_fingerpaint.jpg",
                "position": "center"
                
                
                }],
            "text": "Story 2 of 4",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "autoProceed": false,
            "showPreviousButton": false,
            "parentTextBlock": {
                "text": "Your child will now listen to the second of four stories. There will be a break after each story. You may pause anytime by pressing the space bar.",
                "title": "For parents:"
            }
        },
        "story3-title": {
            "kind": "exp-lookit-images-audio",
            "audio": "story3_intro",
            "images": [{
                "id": "fingerpaint",
                "src": "button_fingerpaint.jpg",
                "position": "center"
                
                
                }],
            "text": "Story 3 of 4",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "autoProceed": false,
            "showPreviousButton": false,
            "parentTextBlock": {
                "text": "Your child will now listen to the third of four stories. There will be a break after each story. You may pause anytime by pressing the space bar.",
                "title": "For parents:"
            }
        },
        "story4-title": {
            "kind": "exp-lookit-images-audio",
            "audio": "story4_intro",
            "images": [{
                "id": "fingerpaint",
                "src": "button_fingerpaint.jpg",
                "position": "center"
                
                
                }],
            "text": "Story 4 of 4",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "autoProceed": false,
            "showPreviousButton": false,
            "parentTextBlock": {
                "text": "Your child will now listen to the last of four stories. There will be a break after each story. You may pause anytime by pressing the space bar.",
                "title": "For parents:"
            }
        },
        "start-recording": {
            "kind": "exp-lookit-start-recording",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "videoTypes": [
                "webm",
                "mp4"
            ],
            "image": "button_watercolors.jpg",
            "imageAnimation": "spin",
            "displayFullscreen": true,
            "startSessionRecording": true
        },
        "exit-survey": {
            "kind": "exp-lookit-exit-survey",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "debriefing": {
                "title": "Thank you!",
                "text": "Our study is interested in how children answer questions that use wh-words like ‘who,’ ‘what,’ ‘where,’ ‘when,’ ‘why,’ and ‘how.’ You may already know that wh-words can have a different position in the sentence depending on the language you speak (e.g. at the beginning of a question in English vs. in the middle of a sentence in Mandarin). Though these languages seem different, some scientists think that they are using the same structures below the surface. It’s hard to test these theories, though! How can we get a look at the grammatical structure someone is using in their head? One way is to study how children learn grammar. \n \n Scientists think children are born with knowledge about how languages work, or that this knowledge is encoded in our brains somehow at birth. This would explain how children can learn a language so easily. If we can find out what children know about languages, then we might be able to learn more about the basic structures that organize all human languages! The idea that languages share some common structure is called Universal Grammar, and  <a href='https://www.ted.com/talks/cameron_morin_what_do_all_languages_have_in_common#t-17176' rel='noopener' target='_blank'> this TED talk </a> is a great place to learn more about how this idea has influenced our research today. Here's <a 'https://www.ted.com/talks/patricia_kuhl_the_linguistic_genius_of_babies?language=en' rel='nonopener' target='_blank'> another great talk </a> about how this theory relates to babies. \n \n Hopefully, learning more about how negative words like ‘n’t’ and ‘not’ affect these types of questions will tell us more about the knowledge children are using to learn English. There are already some <a href='https://scholarworks.umass.edu/dissertations/AAI3012107' rel='noopener' target='_blank'> complicated theories </a> out there that we're hoping to expand upon. We believe that children use some combination of syntactic (i.e. grammatical) and semantic (i.e. meaning-based) rules to figure out how to answer a question like the ones in our study. \n \n Please don't worry about how your child answered during the experiment. It's completely normal for children to struggle with these questions and answer them differently from how you would! Even as a grown-up, questions like 'Who didn't she ask to clean?' are confusing! In the end, we're learning about the possibilities of human grammar from your child--not testing them--so we're serious when we say there are no wrong answers! \n \n Thank you again for being a part of our study. If you’re interested in learning more about this experiment, please feel free to reach out to X",
                "image": {
                    "src": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/img/button_fingerpaint.jpg",
                    "top": 5,
                    "left": 30,
                    "width": 40,
                    "alt": "Orange finger paint"
            
                }
            }
        },
        "character-intro1": {
            "kind": "exp-lookit-images-audio",
            "audio": "character_intro1",
            "images": [{
                    "id": "johnny",
                    "src": "button_johnny.jpg",
                    "left": 10,
                    "top": 1,
                    "width": 20,
                    "displayDelayMs": 8000
                },
                {
                    "id": "estela",
                    "src": "button_estela.jpg",
                    "left": 40,
                    "top": 1,
                    "width": 20,
                    "displayDelayMs": 9000
                },
                {
                    "id": "kathy",
                    "src": "button_kathy.jpg",
                    "left": 70,
                    "top": 1,
                    "width": 20,
                    "displayDelayMs": 10000
                },
                {
                    "id": "george",
                    "src": "button_george.jpg",
                    "top": 50,
                    "left": 10,
                    "width": 20,
                    "displayDelayMs": 11000

                },
                {
                    "id": "ms_lambkin",
                    "src": "button_lambkin.jpg",
                    "top": 45,
                    "left": 40,
                    "width": 20,
                    "displayDelayMs": 47000
                },
                {
                    "id": "mr_bashir",
                    "src": "button_bashir.jpg",
                    "top": 45,
                    "left": 70,
                    "width": 20,
                    "displayDelayMs": 48000
                }
            ],
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "audioTypes": [
                "mp3",
                "ogg"
            ],
            "highlights": [{
                    "range": [14.280272, 22.267937],
                    "imageId": "johnny"
                },
                {
                    "range": [22.918095, 31.207619],
                    "imageId": "estela"
                },
                {
                    "range": [31.532698, 39.148844],
                    "imageId": "kathy"
                },
                {
                    "range": [39.381043, 47.136508],
                    "imageId": "george"
                },
                {
                    "range": [52.662857, 62.322358],
                    "imageId": "ms_lambkin"
                },
                {
                    "range": [62.740317, 75.557732],
                    "imageId": "mr_bashir"
                }

            ],
            "autoProceed": true,
            "doRecording": false,
            "durationSeconds": 76,
            "parentTextBlock": {
                "text": "These are the characters who will appear in this study.",
                "title": "For parents"
            },
            "showProgressBar": true
        },
        "character-intro2": {
            "kind": "exp-lookit-images-audio",
            "audio": "character_intro2",
            "images": [{
                    "id": "johnny",
                    "src": "button_johnny.jpg",
                    "left": 10,
                    "top": 1,
                    "width": 20

                },
                {
                    "id": "estela",
                    "src": "button_estela.jpg",
                    "left": 40,
                    "width": 20

                },
                {
                    "id": "kathy",
                    "src": "button_kathy.jpg",
                    "left": 70,
                    "width": 20
                },
                {
                    "id": "george",
                    "src": "button_george.jpg",
                    "top": 50,
                    "left": 10,
                    "width": 20

                },
                {
                    "id": "ms_lambkin",
                    "src": "button_lambkin.jpg",
                    "top": 45,
                    "left": 40,
                    "width": 20
                },
                {
                    "id": "mr_bashir",
                    "src": "button_bashir.jpg",
                    "top": 45,
                    "left": 70,
                    "width": 20
                }
            ],
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "audioTypes": [
                "mp3",
                "ogg"
            ],
            "highlights": [{
                    "range": [2.55, 4.17],
                    "imageId": "johnny"
                },
                {
                    "range": [4.55, 6.54],
                    "imageId": "estela"
                },
                {
                    "range": [6.87, 8.78],
                    "imageId": "kathy"
                },
                {
                    "range": [8.96, 10.87],
                    "imageId": "george"
                },
                {
                    "range": [11.24, 13.37],
                    "imageId": "ms_lambkin"
                },
                {
                    "range": [13.77, 16.54],
                    "imageId": "mr_bashir"
                }

            ],
            "autoProceed": false,
            "doRecording": false,
            "durationSeconds": 20,
            "parentTextBlock": {
                "text": "These are the characters who will appear in this study.",
                "title": "For parents"
            },
            "showProgressBar": true

        },
        "study-intro": {
            "blocks": [
        {
            "emph": true,
            "title": "Before we get started, here's what will happen in the study:"
        },
        {
            "listblocks": [
                {
                    "text": "First, we will introduce you and your child to the characters in the study."
                },
                {
                    "text": "Then you and your child will listen to four stories and answer six questions about each story."
                },
                {
                    "text": "To answer a question, your child will choose one of four buttons on a screen. If needed, please help your child click."
                },
                {
                    "text": "If your child needs a break, you may pause anytime by pressing the spacebar."
                }
                
            ]
        },
        {
            "text": "We know some questions are tricky. However,  we ask that you avoid helping your child choose an answer. Instead, please offer to listen to the story again and encourage them to give their best guess. There are no right answers! \n \n If you and your child are ready to begin the experiment, press 'Next'."
        }
    ],
            "showPreviousButton": false,
            "kind": "exp-lookit-text"
        },
        "video-consent": {
            "kind": "exp-lookit-video-consent",
            "template": "consent_005",
            "PIName": "Y",
            "institution": "S",
            "PIContact": "Y email",
            "purpose": "This study is designed to understand how negation words (“n’t” and “not”) affect children’s answers to questions using “who” and “why”.",
            "procedures": "Participants will listen to four stories, each accompanied by six pictures. All stories will include named characters who will engage with each other during various art and classroom activities. At various points throughout the story, your child will be prompted to answer questions about events in the story.",
            "participation": "You and your child are free to choose whether to be in this study. If you choose to participate, it's okay to stop at any point during the session. Please pause or stop the session if your child becomes very fussy or does not want to participate! You may pause at any point by pressing the space bar.",
            "payment": "Participants may benefit by enjoying the opportunity to contribute to science. Additionally, we will email a Junior Scientist Certificate to families who participate and have elected to provide us with their email. There are no additional benefits anticipated. Though we have taken care to design our study to be engaging, age-appropriate, and fun, it’s possible your child may feel bored or distressed sitting in front of a computer for the full duration of the experiment. If your child becomes bored or fussy at any point, please pause or stop the session. It is also possible that you or your child may experience social embarrassment during the recorded testing session due to unexpected interruptions and the sensitive nature of recording within one’s home. While we have taken measures to minimize the risk of embarrassment, it is still possible that something unexpected may happen. For this reason, if any unexpected event occurs, you will have the opportunity to withdraw your video at the end of the experiment. In this case, only your participation data (i.e. which buttons your child clicked to answer questions) and consent video will be preserved. We expect there to be no risk of physical harm during the experiment.",
            "datause": "We are primarily interested in responses to questions during the study. A research assistant will watch your video to confirm that participants were paying attention to the stimuli during the experiment.",
            "gdpr": false,
            "research_rights_statement": "You have a right to be treated with courtesy and respect. Additionally, you have a right to withdraw your data and consent at any point in time. If you have any complaints about the study, you can contact the S Institutional Review Board, at email or by completing a Participant Complaint Form at url. "
        },
        
        "video-assent": {
            "kind": "exp-lookit-video-assent",
            "pages": [{
                    "imgSrc": "A1-ARG-1.jpg",
                    "altText": "Intro picture",
                    "textBlocks": [{
                        "text": "Welcome to our game! We’re happy you’re here. We invited you to be in this experiment because we want to know how kids think about stories about art class. If you agree to play our game, you will help us learn about kids just like you.",
                        "css": {
                            "color": "black",
                            "font-size": "small"
                        }
                    }],
                    "audio": "assent1"
                },
                {
                    "imgSrc": "A1-ADJ-1.jpg",
                    "altText": "Two children painting together",
                    "textBlocks": [{
                        "text": "In our game, you will listen to some stories, look at pictures, and answer questions about what happens. First you will hear part of the story and look at the pictures. Look and listen carefully! Here is an example of a picture you will see.",
                        "css": {
                            "color": "black",
                            "font-size": "small"
                        }
                    }],
                    "audio": "assent2"
                },
                {
                    "imgSrc": "example_button_array.jpg",
                    "altText": "Example buttons",
                    "textBlocks": [{
                        "text": "Sometimes we will ask a question about what happens in the story. To answer the questions, you will pick one of the buttons on the screen. Here are some examples of the buttons you will see.",
                        "css": {
                            "color": "black",
                            "font-size": "small"
                        }
                    }],
                    "audio": "assent3"
                },
                {
                    "imgSrc": "button_previous.jpg",
                    "altText": "Previous button",
                    "textBlocks": [{
                        "text": "Don’t worry if you don’t know how to answer a question! These questions are tricky for grownups, too, so it's okay if you're not sure. Just make your very best guess. If you feel stuck, click this button to listen to the story again. If you ever feel like you don't want to play anymore, you can stop anytime by asking your grown-up for help.",
                        "css": {
                            "color": "black",
                            "font-size": "small"
                        }
                    }],
                    "audio": "assent4"
                },
                {
                    "showWebcam": true,
                    "textBlocks": [{
                        "text": "During the study, your webcam will record a video of you just like this one here. We will watch the recording later to make sure you are paying attention to the stories. Now we need you to decide whether you want to play our game. Remember: even if you decide to play now, you can stop playing at any point!",
                        "css": {
                            "color": "black",
                            "font-size": "small"
                        }
                    }],
                    "audio": "assent5"
                }
            ],
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "videoTypes": [
                "webm",
                "mp4"
            ],
            "participationQuestion": "Do you want to participate in this study?"
        }
    };
    //////////////////////////////////////////////////////////////////////
    // ADD ALL THE FRAMES YOU WANT TO HAPPEN BEFORE THE STORIES UNDER HERE
    //////////////////////////////////////////////////////////////////////
    //let frame_sequence = ["exit-survey"];
    let frame_sequence = ['video-config','video-consent','video-assent','study-intro', 'character-intro1', 'character-intro2'];
    //let frame_sequence = ['video-config','video-consent', 'video-assent','character-intro1', 'character-intro2', 'study-intro']; // <-HERE 


    // List out all your stimulus pairings for each story!
    // example:
    //  "ARG0": <- What kind of question are we asking?
    //  {   
    //      "A": [     <- What version of question are we asking?
    //      "storyImage" <- What story image should we use?
    //      "storyAudio" <- What story audio should we use?
    //      "questionImageSet" <- What buttons do we show?
    //      "questionAudio" <- What question audio do we use?
    //      ],
    //      [
    //      "B": [  <- What version of question are we asking?
    //      "storyImage" <- What story image should we use?
    //      "storyAudio" <- What story audio should we use?
    //      "questionImageSet" <- What buttons do we show?
    //      "questionAudio" <- What question audio do we use?
    //      ],
    //  }
    // List out all your stimulus pairings for each story!
    // example:
    //  "ARG0": <- What kind of question are we asking?
    //  {  
    //      "A": [     <- What version of question are we asking?
    //      "storyImage" <- What story image should we use?
    //      "storyAudio" <- What story audio should we use?
    //      "questionImageSet" <- What buttons do we show?
    //      "questionAudio" <- What question audio do we use?
    //      ],
    //      [
    //      "B": [  <- What version of question are we asking?
    //      "storyImage" <- What story image should we use?
    //      "storyAudio" <- What story audio should we use?
    //      "questionImageSet" <- What buttons do we show?
    //      "questionAudio" <- What question audio do we use?
    //      ],
    //  }
    let storyAsk1_pairings = {
        "ADJ0": {
            "A": [
                "A1-ADJ-0.jpg",
                "A1-ADJ-0-A",
                "A1-ADJ-0Buttons",
                "Q-A1-ADJ-0-A"
            ],
            "B": [
                "A1-ADJ-0.jpg",
                "A1-ADJ-0-B",
                "A1-ADJ-0Buttons",
                "Q-A1-ADJ-0-B"
            ]

        },
        "ARG0": {
            "A": [
                "A1-ARG-0.jpg",
                "A1-ARG-0-A",
                "A1-ARG-0Buttons",
                "Q-A1-ARG-0-A"
            ],
            "B": [
                "A1-ARG-0.jpg",
                "A1-ARG-0-B",
                "A1-ARG-0Buttons",
                "Q-A1-ARG-0-B"
            ]

        },
        "ADJ1": {
            "A": [
                "A1-ADJ-1.jpg",
                "A1-ADJ-1-A",
                "A1-ADJ-1Buttons",
                "Q-A1-ADJ-1-A"
            ],
            "B": [
                "A1-ADJ-1.jpg",
                "A1-ADJ-1-B",
                "A1-ADJ-1Buttons",
                "Q-A1-ADJ-1-B"
            ]

        },
        "ARG1": {
            "A": [
                "A1-ARG-1.jpg",
                "A1-ARG-1-A",
                "A1-ARG-1Buttons",
                "Q-A1-ARG-1-A"
            ],
            "B": [
                "A1-ARG-1.jpg",
                "A1-ARG-1-B",
                "A1-ARG-1Buttons",
                "Q-A1-ARG-1-B"
            ]

        },
        "ADJ2": {
            "A": [
                "A1-ADJ-2.jpg",
                "A1-ADJ-2-A",
                "A1-ADJ-2Buttons",
                "Q-A1-ADJ-2-A"
            ],
            "B": [
                "A1-ADJ-2.jpg",
                "A1-ADJ-2-B",
                "A1-ADJ-2Buttons",
                "Q-A1-ADJ-2-B"
            ]

        },
        "ARG2": {
            "A": [
                "A1-ARG-2.jpg",
                "A1-ARG-2-A",
                "A1-ARG-2Buttons",
                "Q-A1-ARG-2-A"
            ],
            "B": [
                "A1-ARG-2.jpg",
                "A1-ARG-2-B",
                "A1-ARG-2Buttons",
                "Q-A1-ARG-2-B"
            ]

        }
    };
    let storyAsk2_pairings = {
        "ADJ0": {
            "A": [
                "A2-ADJ-0.jpg",
                "A2-ADJ-0-A",
                "A2-ADJ-0Buttons",
                "Q-A2-ADJ-0-A"
            ],
            "B": [
                "A2-ADJ-0.jpg",
                "A2-ADJ-0-B",
                "A2-ADJ-0Buttons",
                "Q-A2-ADJ-0-B"
            ]

        },
        "ARG0": {
            "A": [
                "A2-ARG-0.jpg",
                "A2-ARG-0-A",
                "A2-ARG-0Buttons",
                "Q-A2-ARG-0-A"
            ],
            "B": [
                "A2-ARG-0.jpg",
                "A2-ARG-0-B",
                "A2-ARG-0Buttons",
                "Q-A2-ARG-0-B"
            ]

        },
        "ADJ1": {
            "A": [
                "A2-ADJ-1.jpg",
                "A2-ADJ-1-A",
                "A2-ADJ-1Buttons",
                "Q-A2-ADJ-1-A"
            ],
            "B": [
                "A2-ADJ-1.jpg",
                "A2-ADJ-1-B",
                "A2-ADJ-1Buttons",
                "Q-A2-ADJ-1-B"
            ]

        },
        "ARG1": {
            "A": [
                "A2-ARG-1.jpg",
                "A2-ARG-1-A",
                "A2-ARG-1Buttons",
                "Q-A2-ARG-1-A"
            ],
            "B": [
                "A2-ARG-1.jpg",
                "A2-ARG-1-B",
                "A2-ARG-1Buttons",
                "Q-A2-ARG-1-B"
            ]

        },
        "ADJ2": {
            "A": [
                "A2-ADJ-2.jpg",
                "A2-ADJ-2-A",
                "A2-ADJ-2Buttons",
                "Q-A2-ADJ-2-A"
            ],
            "B": [
                "A2-ADJ-2.jpg",
                "A2-ADJ-2-B",
                "A2-ADJ-2Buttons",
                "Q-A2-ADJ-2-B"
            ]
        },
        "ARG2": {
            "A": [
                "A2-ARG-2.jpg",
                "A2-ARG-2-A",
                "A2-ARG-2Buttons",
                "Q-A2-ARG-2-A"
            ],
            "B": [
                "A2-ARG-2.jpg",
                "A2-ARG-2-B",
                "A2-ARG-2Buttons",
                "Q-A2-ARG-2-B"
            ]
        }
    };
    let storyPromise1_pairings = {
        "ADJ0": {
            "A": [
                "P1-ADJ-0.jpg",
                "P1-ADJ-0-A",
                "P1-ADJ-0Buttons",
                "Q-P1-ADJ-0-A"
            ],
            "B": [
                "P1-ADJ-0.jpg",
                "P1-ADJ-0-B",
                "P1-ADJ-0Buttons",
                "Q-P1-ADJ-0-B"
            ]
        },
        "ARG0": {
            "A": [
                "P1-ARG-0.jpg",
                "P1-ARG-0-A",
                "P1-ARG-0Buttons",
                "Q-P1-ARG-0-A"
            ],
            "B": [
                "P1-ARG-0.jpg",
                "P1-ARG-0-B",
                "P1-ARG-0Buttons",
                "Q-P1-ARG-0-B"
            ]
        },
        "ADJ1": {
            "A": [
                "P1-ADJ-1.jpg",
                "P1-ADJ-1-A",
                "P1-ADJ-1Buttons",
                "Q-P1-ADJ-1-A"
            ],
            "B": [
                "P1-ADJ-1.jpg",
                "P1-ADJ-1-B",
                "P1-ADJ-1Buttons",
                "Q-P1-ADJ-1-B"
            ]
        },
        "ARG1": {
            "A": [
                "P1-ARG-1-A.jpg",
                "P1-ARG-1-A",
                "P1-ARG-1Buttons",
                "Q-P1-ARG-1-A"
            ],
            "B": [
                "P1-ARG-1-B.jpg",
                "P1-ARG-1-B",
                "P1-ARG-1Buttons",
                "Q-P1-ARG-1-B"
            ]
        },
        "ADJ2": {
            "A": [
                "P1-ADJ-2.jpg",
                "P1-ADJ-2-A",
                "P1-ADJ-2Buttons",
                "Q-P1-ADJ-2-A"
            ],
            "B": [
                "P1-ADJ-2.jpg",
                "P1-ADJ-2-B",
                "P1-ADJ-2Buttons",
                "Q-P1-ADJ-2-B"
            ]
        },
        "ARG2": {
            "A": [
                "P1-ARG-2.jpg",
                "P1-ARG-2-A",
                "P1-ARG-2Buttons",
                "Q-P1-ARG-2-A"
            ],
            "B": [
                "P1-ARG-2.jpg",
                "P1-ARG-2-B",
                "P1-ARG-2Buttons",
                "Q-P1-ARG-2-B"
            ]
        }
    };
    let storyPromise2_pairings = {
        "ADJ0": {
            "A": [
                "P2-ADJ-0.jpg",
                "P2-ADJ-0-A",
                "P2-ADJ-0Buttons",
                "Q-P2-ADJ-0-A"
            ],
            "B": [
                "P2-ADJ-0.jpg",
                "P2-ADJ-0-B",
                "P2-ADJ-0Buttons",
                "Q-P2-ADJ-0-B"
            ]
        },
        "ARG0": {
            "A": [
                "P2-ARG-0-A.jpg",
                "P2-ARG-0-A",
                "P2-ARG-0Buttons",
                "Q-P2-ARG-0-A"
            ],
            "B": [
                "P2-ARG-0-B.jpg",
                "P2-ARG-0-B",
                "P2-ARG-0Buttons",
                "Q-P2-ARG-0-B"
            ]
        },
        "ADJ1": {
            "A": [
                "P2-ADJ-1.jpg",
                "P2-ADJ-1-A",
                "P2-ADJ-1Buttons",
                "Q-P2-ADJ-1-A"
            ],
            "B": [
                "P2-ADJ-1.jpg",
                "P2-ADJ-1-B",
                "P2-ADJ-1Buttons",
                "Q-P2-ADJ-1-B"
            ]
        },
        "ARG1": {
            "A": [
                "P2-ARG-1-A.jpg",
                "P2-ARG-1-A",
                "P2-ARG-1Buttons",
                "Q-P2-ARG-1-A"
            ],
            "B": [
                "P2-ARG-1-B.jpg",
                "P2-ARG-1-B",
                "P2-ARG-1Buttons",
                "Q-P2-ARG-1-B"
            ]
        },
        "ADJ2": {
            "A": [
                "P2-ADJ-2.jpg",
                "P2-ADJ-2-A",
                "P2-ADJ-2Buttons",
                "Q-P2-ADJ-2-A"
            ],
            "B": [
                "P2-ADJ-2.jpg",
                "P2-ADJ-2-B",
                "P2-ADJ-2Buttons",
                "Q-P2-ADJ-2-B"
            ]
        },
        "ARG2": {
            "A": [
                "P2-ARG-2.jpg",
                "P2-ARG-2-A",
                "P2-ARG-2Buttons",
                "Q-P2-ARG-2-A"
            ],
            "B": [
                "P2-ARG-2.jpg",
                "P2-ARG-2-B",
                "P2-ARG-2Buttons",
                "Q-P2-ARG-2-B"
            ]
        }
    };

    // List out what images can appear during each question
    //
    // example:
    //
    //  "questionImageSet": <- What image/image set do we need?
    //      [    
    //      "image1", <- here list all possible images that can be used--
    //      "image2"     it's okay if there is only one!
    //      ]

    let available_buttons = {
        ////////////////////////////
        //   ASK1 BUTTON IMAGES   //
        ////////////////////////////  
        "A1-ADJ-0Buttons": [
            "button_whisper.jpg",
            "button_bothHands.jpg",
            "button_loud.jpg",
            "button_fingerpaint.jpg"
        ],
        "A1-ADJ-1Buttons": [
            "button_whisper.jpg",
            "button_watercolors.jpg",
            "button_loud.jpg",
            "button_fingerpaint.jpg"
        ],
        "A1-ADJ-2Buttons": [
            "button_whisper.jpg",
            "button_broom.jpg",
            "button_megaphone.jpg",
            "button_sponge.jpg"
        ],
        "A1-ARG-0Buttons": [
            "button_bashir.jpg",
            "button_estela.jpg",
            "button_george.jpg",
            "button_johnny.jpg"
        ],
        "A1-ARG-1Buttons": [
            "button_lambkin.jpg",
            "button_estela.jpg",
            "button_george.jpg",
            "button_kathy.jpg"
        ],
        "A1-ARG-2Buttons": [
            "button_lambkin.jpg",
            "button_estela.jpg",
            "button_george.jpg",
            "button_kathy.jpg"
        ],
        ////////////////////////////
        //   ASK2 BUTTON IMAGES   //
        ////////////////////////////  
        "A2-ADJ-0Buttons": [
            "button_whisper.jpg",
            "button_sponge.jpg",
            "button_loud.jpg",
            "button_mop.jpg"
        ],
        "A2-ADJ-1Buttons": [
            "button_phone.jpg",
            "button_glue.jpg",
            "button_walkietalkie.jpg",
            "button_blue.jpg"
        ],
        "A2-ADJ-2Buttons": [
            "button_whisper.jpg",
            "button_loud.jpg",
            "button_pencils.jpg",
            "button_crayons.jpg"
        ],
        "A2-ARG-0Buttons": [
            "button_lambkin.jpg",
            "button_estela.jpg",
            "button_george.jpg",
            "button_johnny.jpg"
        ],
        "A2-ARG-1Buttons": [
            "button_lambkin.jpg",
            "button_estela.jpg",
            "button_george.jpg",
            "button_kathy.jpg"
        ],
        "A2-ARG-2Buttons": [
            "button_lambkin.jpg",
            "button_estela.jpg",
            "button_george.jpg",
            "button_kathy.jpg"
        ],
        ////////////////////////////
        // PROMISE1 BUTTON IMAGES //
        ////////////////////////////  
        "P1-ADJ-0Buttons": [
            "button_pinky.jpg",
            "button_onehand.jpg",
            "button_crossed.jpg",
            "button_video.jpg"
        ],
        "P1-ADJ-1Buttons": [
            "button_raised.jpg",
            "button_sweeping.jpg",
            "button_heart.jpg",
            "button_cups.jpg"
        ],
        "P1-ADJ-2Buttons": [
            "button_phone.jpg",
            "button_hose.jpg",
            "button_heart.jpg",
            "button_bucket.jpg"
        ],
        "P1-ARG-0Buttons": [
            "button_lambkin.jpg",
            "button_johnny.jpg",
            "button_george.jpg",
            "button_kathy.jpg"
        ],
        "P1-ARG-1Buttons": [
            "button_johnny.jpg",
            "button_lambkin.jpg",
            "button_george.jpg",
            "button_estela.jpg"
        ],
        "P1-ARG-2Buttons": [
            "button_johnny.jpg",
            "button_kathy.jpg",
            "button_lambkin.jpg",
            "button_estela.jpg"
        ],
        ////////////////////////////
        // PROMISE2 BUTTON IMAGES //
        ////////////////////////////  
        "P2-ADJ-0Buttons": [
            "button_heart.jpg",
            "button_drawing.jpg",
            "button_crossed.jpg",
            "button_painting.jpg"
        ],
        "P2-ADJ-1Buttons": [
            "button_heart.jpg",
            "button_block.jpg",
            "button_crossed.jpg",
            "button_video.jpg"
        ],
        "P2-ADJ-2Buttons": [
            "button_walkietalkie.jpg",
            "button_watercolors.jpg",
            "button_facetime.jpg",
            "button_oil.jpg"
        ],
        "P2-ARG-0Buttons": [
            "button_lambkin.jpg",
            "button_kathy.jpg",
            "button_estela.jpg",
            "button_george.jpg"
        ],
        "P2-ARG-1Buttons": [
            "button_kathy.jpg",
            "button_estela.jpg",
            "button_lambkin.jpg",
            "button_george.jpg"
        ],
        "P2-ARG-2Buttons": [
            "button_lambkin.jpg",
            "button_johnny.jpg",
            "button_george.jpg",
            "button_estela.jpg"
        ]
    };

    // Initialize object to keep track of versions and randomization for each
    // story
    let ask1QVs = {
        "ADJ0": [],
        "ADJ1": [],
        "ADJ2": [],
        "ARG0": [],
        "ARG1": [],
        "ARG2": [],
        "QSequence": ["ADJ0", "ADJ1", "ADJ2", "ARG0", "ARG1", "ARG2"]
    };
    let promise1QVs = {
        "ADJ0": [],
        "ADJ1": [],
        "ADJ2": [],
        "ARG0": [],
        "ARG1": [],
        "ARG2": [],
        "QSequence": ["ADJ0", "ADJ1", "ADJ2", "ARG0", "ARG1", "ARG2"]
    };
    let ask2QVs = {
        "ADJ0": [],
        "ADJ1": [],
        "ADJ2": [],
        "ARG0": [],
        "ARG1": [],
        "ARG2": [],
        "QSequence": ["ADJ0", "ADJ1", "ADJ2", "ARG0", "ARG1", "ARG2"]
    };
    let promise2QVs = {
        "ADJ0": [],
        "ADJ1": [],
        "ADJ2": [],
        "ARG0": [],
        "ARG1": [],
        "ARG2": [],
        "QSequence": ["ADJ0", "ADJ1", "ADJ2", "ARG0", "ARG1", "ARG2"]
    };

    // Time to assign question versions
    for (i = 0; i < 12; i++) {
        // Get random version (A or B)
        let version = getRandomVersion();
        // Assign question versions
        if (i === 0) {
            ask1QVs.ADJ0 = version;
            ask2QVs.ADJ0 = getOppositeVersion(version);
        }
        if (i == 1) {
            promise1QVs.ADJ0 = version;
            promise2QVs.ADJ0 = getOppositeVersion(version);
        }
        if (i == 2) {
            ask1QVs.ADJ1 = version;
            ask2QVs.ADJ1 = getOppositeVersion(version);
        }
        if (i == 3) {
            promise1QVs.ADJ1 = version;
            promise2QVs.ADJ1 = getOppositeVersion(version);
        }
        if (i == 4) {
            ask1QVs.ADJ2 = version;
            ask2QVs.ADJ2 = getOppositeVersion(version);
        }
        if (i == 5) {
            promise1QVs.ADJ2 = version;
            promise2QVs.ADJ2 = getOppositeVersion(version);
        }
        if (i == 6) {
            ask1QVs.ARG0 = version;
            ask2QVs.ARG0 = getOppositeVersion(version);
        }
        if (i == 7) {
            promise1QVs.ARG0 = version;
            promise2QVs.ARG0 = getOppositeVersion(version);
        }
        if (i == 8) {
            ask1QVs.ARG1 = version;
            ask2QVs.ARG1 = getOppositeVersion(version);
        }
        if (i == 9) {
            promise1QVs.ARG1 = version;
            promise2QVs.ARG1 = getOppositeVersion(version);
        }
        if (i == 10) {
            ask1QVs.ARG2 = version;
            ask2QVs.ARG2 = getOppositeVersion(version);
        }
        if (i == 11) {
            promise1QVs.ARG2 = version;
            promise2QVs.ARG2 = getOppositeVersion(version);
        }
    }

    // Shuffle the question order for each story
    ask1QVs.QSequence = shuffle(ask1QVs.QSequence);
    ask2QVs.QSequence = shuffle(ask2QVs.QSequence);
    promise1QVs.QSequence = shuffle(promise1QVs.QSequence);
    promise2QVs.QSequence = shuffle(promise2QVs.QSequence);

    // Initialize array to store the frames in each story
    let storyAsk1Seq = [];
    let storyAsk2Seq = [];
    let storyPromise1Seq = [];
    let storyPromise2Seq = [];

    // Now it's time to make the actual frames and add them to the arrays above
    ////////////////////////////////////////////////
    // ASK 1 STORY
    ////////////////////////////////////////////////
    for (index = 0; index < 6; index++) {
        // get the question and version info
        let question = ask1QVs.QSequence[index];
        let version = ask1QVs[question];

        // set of stimulus pairings for this question+version pair
        let stimulus_pairings = storyAsk1_pairings[question];
        let trialPair = stimulus_pairings[version];

        // get and set the stimuli for the frames
        let expositionFrame = "Ask1-" + question + version + "-Exposition"; // exposition trial name
        let questionFrame = "Ask1-" + question + version + "-Question"; // question trial name
        let storyImage = trialPair[0]; // illustration for exposition frame
        let storyAudio = trialPair[1]; // audio for exposition frame
        let questionImageSet = trialPair[2]; // set of images to make buttons
        let questionAudio = trialPair[3]; // audio for the question

        // pick buttons in random order
        choices = shuffle(available_buttons[questionImageSet]);
        let choice = choices[0];
        let choice1 = choices[1];
        let choice2 = choices[2];
        let choice3 = choices[3];

        expositionTrial = {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "audio": storyAudio,
            "images": [{
                "id": "storyIllustration",
                "src": storyImage,
                "position": "fill"
            }],
            "audioTypes": [
                "mp3",
                "ogg"
            ],
            "autoProceed": false,
            "doRecording": false,
            "showProgressBar": true,
            "ShowReplayButton": true
        };

        questionTrial = {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "audio": questionAudio,
            "images": [{
                    "id": "storyIllustration",
                    "src": storyImage,
                    "left": 5,
                    "top": 20,
                    "width": 40,
                    "nonChoiceOption": true,
                },   
                {    
                    "id": "choice0",
                    "src": choice,
                    "left": 55,
                    "top": 20,
                    "width": 15,
                    "feedbackAudio": "feedback"
                },
                {
                    "id": "choice1",
                    "src": choice1,
                    "left": 75,
                    "top": 20,
                    "width": 15,
                    "feedbackAudio": "feedback"
                },
                {
                    "id": "choice2",
                    "src": choice2,
                    "left": 55,
                    "top": 55,
                    "width": 15,
                    "feedbackAudio": "feedback"
                },
                {
                    "id": "choice3",
                    "src": choice3,
                    "left": 75,
                    "top": 55,
                    "width": 15,
                    "feedbackAudio": "feedback"
                }
            ],
            "audioTypes": [
                "mp3",
                "ogg"
            ],
            "autoProceed": false,
            "ShowReplayButton": true,
            "doRecording": false,
            "parentTextBlock": {
                "text": "If your child is stuck, please do not suggest an answer. Instead, we invite you to help by encouraging your child to guess and offering to listen to the story again. Reminder: pause at any point by pressing the space bar.",
                "title": "For parents",
                "css": {
                    "color": "black",
                    "font-size": "medium"
                }
            },
            "choiceRequired": true,
            "canMakeChoiceBeforeAudioFinished": false
        };
        // Store the frames in frames and in the story sequence
        frames[expositionFrame] = expositionTrial;
        frames[questionFrame] = questionTrial;
        storyAsk1Seq.push(expositionFrame);
        storyAsk1Seq.push(questionFrame);
    }
    
    ////////////////////////////////////////////////
    // ASK 2 STORY
    ////////////////////////////////////////////////
    for (index = 0; index < 6; index++) {
        // get the question and version info
        let question = ask2QVs.QSequence[index];
        let version = ask2QVs[question];

        // set of stimulus pairings for this question+version pair
        let stimulus_pairings = storyAsk2_pairings[question];
        let trialPair = stimulus_pairings[version];

        // get and set the stimuli for the frames
        let expositionFrame = "Ask2-" + question + version + "-Exposition"; // exposition trial name
        let questionFrame = "Ask2-" + question + version + "-Question"; // question trial name
        let storyImage = trialPair[0]; // illustration for exposition frame
        let storyAudio = trialPair[1]; // audio for exposition frame
        let questionImageSet = trialPair[2]; // set of images to make buttons
        let questionAudio = trialPair[3]; // audio for the question
        
        // pick buttons in random order
        choices = shuffle(available_buttons[questionImageSet]);
        let choice = choices[0];
        let choice1 = choices[1];
        let choice2 = choices[2];
        let choice3 = choices[3];

        expositionTrial = {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "audio": storyAudio,
            "images": [{
                "id": "storyIllustration",
                "src": storyImage,
                "position": "fill"
            }],
            "audioTypes": [
                "mp3",
                "ogg"
            ],
            "autoProceed": false,
            "doRecording": false,
            "showProgressBar": true,
            "ShowReplayButton": true
        };

        questionTrial = {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "audio": questionAudio,
            "images": [{
                    "id": "storyIllustration",
                    "src": storyImage,
                    "left": 5,
                    "top": 20,
                    "width": 40,
                    "nonChoiceOption": true,
                },   
                {    
                    "id": "choice0",
                    "src": choice,
                    "left": 55,
                    "top": 20,
                    "width": 15,
                    "feedbackAudio": "feedback"
                },
                {
                    "id": "choice1",
                    "src": choice1,
                    "left": 75,
                    "top": 20,
                    "width": 15,
                    "feedbackAudio": "feedback"
                },
                {
                    "id": "choice2",
                    "src": choice2,
                    "left": 55,
                    "top": 55,
                    "width": 15,
                    "feedbackAudio": "feedback"
                },
                {
                    "id": "choice3",
                    "src": choice3,
                    "left": 75,
                    "top": 55,
                    "width": 15,
                    "feedbackAudio": "feedback"
                }
            ],
            "audioTypes": [
                "mp3",
                "ogg"
            ],
            "autoProceed": false,
            "ShowReplayButton": true,
            "doRecording": false,
            "parentTextBlock": {
                "text": "If your child is stuck, please do not suggest an answer. Instead, we invite you to help by encouraging your child to guess and offering to listen to the story again. Reminder: pause at any point by pressing the space bar.",
                "title": "For parents",
                "css": {
                    "color": "black",
                    "font-size": "medium"
                }
            },
            "choiceRequired": true,
            "canMakeChoiceBeforeAudioFinished": false
        };
        // Store the frames in frames and in the story sequence
        frames[expositionFrame] = expositionTrial;
        frames[questionFrame] = questionTrial;
        storyAsk2Seq.push(expositionFrame);
        storyAsk2Seq.push(questionFrame);
    }

    ////////////////////////////////////////////////
    // PROMISE 1 STORY
    ////////////////////////////////////////////////
    for (index = 0; index < 6; index++) {
        // get the question and version info
        let question = promise1QVs.QSequence[index];
        let version = promise1QVs[question];

        // set of stimulus pairings for this question+version pair
        let stimulus_pairings = storyPromise1_pairings[question];
        let trialPair = stimulus_pairings[version];

        // get and set the stimuli for the frames
        let expositionFrame = "Promise1-" + question + version + "-Exposition"; // exposition trial name
        let questionFrame = "Promise1-" + question + version + "-Question"; // question trial name
        let storyImage = trialPair[0]; // illustration for exposition frame
        let storyAudio = trialPair[1]; // audio for exposition frame
        let questionImageSet = trialPair[2]; // set of images to make buttons
        let questionAudio = trialPair[3]; // audio for the question

        // pick buttons in random order
        choices = shuffle(available_buttons[questionImageSet]);
        let choice = choices[0];
        let choice1 = choices[1];
        let choice2 = choices[2];
        let choice3 = choices[3];

        expositionTrial = {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "audio": storyAudio,
            "images": [{
                "id": "storyIllustration",
                "src": storyImage,
                "position": "fill"
            }],
            "audioTypes": [
                "mp3",
                "ogg"
            ],
            "autoProceed": false,
            "doRecording": false,
            "showProgressBar": true,
            "ShowReplayButton": true
        };

        questionTrial = {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "audio": questionAudio,
            "images": [{
                    "id": "storyIllustration",
                    "src": storyImage,
                    "left": 5,
                    "top": 20,
                    "width": 40,
                    "nonChoiceOption": true,
                },   
                {    
                    "id": "choice0",
                    "src": choice,
                    "left": 55,
                    "top": 20,
                    "width": 15,
                    "feedbackAudio": "feedback"
                },
                {
                    "id": "choice1",
                    "src": choice1,
                    "left": 75,
                    "top": 20,
                    "width": 15,
                    "feedbackAudio": "feedback"
                },
                {
                    "id": "choice2",
                    "src": choice2,
                    "left": 55,
                    "top": 55,
                    "width": 15,
                    "feedbackAudio": "feedback"
                },
                {
                    "id": "choice3",
                    "src": choice3,
                    "left": 75,
                    "top": 55,
                    "width": 15,
                    "feedbackAudio": "feedback"
                }
            ],
            "audioTypes": [
                "mp3",
                "ogg"
            ],
            "autoProceed": false,
            "ShowReplayButton": true,
            "doRecording": false,
            "parentTextBlock": {
                "text": "If your child is stuck, please do not suggest an answer. Instead, we invite you to help by encouraging your child to guess and offering to listen to the story again. Reminder: pause at any point by pressing the space bar.",
                "title": "For parents",
                "css": {
                    "color": "black",
                    "font-size": "medium"
                }
            },
            "choiceRequired": true,
            "canMakeChoiceBeforeAudioFinished": false
        };
        // Store the frames in frames and in the story sequence
        frames[expositionFrame] = expositionTrial;
        frames[questionFrame] = questionTrial;
        storyPromise1Seq.push(expositionFrame);
        storyPromise1Seq.push(questionFrame);
    }
    
    ////////////////////////////////////////////////
    // PROMISE 2 STORY
    ////////////////////////////////////////////////
    for (index = 0; index < 6; index++) {
        // get the question and version info
        let question = promise2QVs.QSequence[index];
        let version = promise2QVs[question];

        // set of stimulus pairings for this question+version pair
        let stimulus_pairings = storyPromise2_pairings[question];
        let trialPair = stimulus_pairings[version];

        // get and set the stimuli for the frames
        let expositionFrame = "Promise2-" + question + version + "-Exposition"; // exposition trial name
        let questionFrame = "Promise2-" + question + version + "-Question"; // question trial name
        let storyImage = trialPair[0]; // illustration for exposition frame
        let storyAudio = trialPair[1]; // audio for exposition frame
        let questionImageSet = trialPair[2]; // set of images to make buttons
        let questionAudio = trialPair[3]; // audio for the question

        // pick buttons in random order
        choices = shuffle(available_buttons[questionImageSet]);
        let choice = choices[0];
        let choice1 = choices[1];
        let choice2 = choices[2];
        let choice3 = choices[3];

        expositionTrial = {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "audio": storyAudio,
            "images": [{
                "id": "storyIllustration",
                "src": storyImage,
                "position": "fill"
            }],
            "audioTypes": [
                "mp3",
                "ogg"
            ],
            "autoProceed": false,
            "doRecording": false,
            "showProgressBar": true,
            "ShowReplayButton": true
        };

        questionTrial = {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/smileyblue77/art_class_storytime/master/",
            "audio": questionAudio,
            "images": [{
                    "id": "storyIllustration",
                    "src": storyImage,
                    "left": 5,
                    "top": 20,
                    "width": 40,
                    "nonChoiceOption": true,
                },   
                {    
                    "id": "choice0",
                    "src": choice,
                    "left": 55,
                    "top": 20,
                    "width": 15,
                    "feedbackAudio": "feedback"
                },
                {
                    "id": "choice1",
                    "src": choice1,
                    "left": 75,
                    "top": 20,
                    "width": 15,
                    "feedbackAudio": "feedback"
                },
                {
                    "id": "choice2",
                    "src": choice2,
                    "left": 55,
                    "top": 55,
                    "width": 15,
                    "feedbackAudio": "feedback"
                },
                {
                    "id": "choice3",
                    "src": choice3,
                    "left": 75,
                    "top": 55,
                    "width": 15,
                    "feedbackAudio": "feedback"
                }
            ],
            "audioTypes": [
                "mp3",
                "ogg"
            ],
            "autoProceed": false,
            "ShowReplayButton": true,
            "doRecording": false,
            "parentTextBlock": {
                "text": "If your child is stuck, please do not suggest an answer. Instead, we invite you to help by encouraging your child to guess and offering to listen to the story again. Reminder: pause at any point by pressing the space bar.",
                "title": "For parents",
                "css": {
                    "color": "black",
                    "font-size": "medium"
                }
            },
            "choiceRequired": true,
            "canMakeChoiceBeforeAudioFinished": false
        };
        // Store the frames in frames and in the story sequence
        frames[expositionFrame] = expositionTrial;
        frames[questionFrame] = questionTrial;
        storyPromise2Seq.push(expositionFrame);
        storyPromise2Seq.push(questionFrame);
    }

    // Shuffle the story order
    let storyOrder = [storyAsk1Seq, storyAsk2Seq, storyPromise1Seq, storyPromise2Seq];
    storyOrder = shuffle(storyOrder);

    // Push the frames onto the frame sequence
    for(i=0; i < 4; i++){
        let story = storyOrder[i];
        /// HERE IS WHERE YOU ADD A TITLE PAGE OR START RECORDING PAGE
        // if you do different title pages for each story then you will need to 
        // use if statements
        frame_sequence = frame_sequence.concat(['start-recording']);
        ///////////////////////
        // j should be the number of frames in a story
        // ex: 6 questions + 6 exposition + 1 start-recording + 1 rest = 14
        //////////////////////
        for(j = 0; j < 12; j++){
            frame_sequence = frame_sequence.concat(story[j]);
        }
        // HERE IS WHERE YOU ADD A STOP RECORDING OR BREAK PAGE
        if(i < 3){
            frame_sequence = frame_sequence.concat(['rest']);
        }
    }
    
    // Finish up the frame sequence with the exit survey
    frame_sequence = frame_sequence.concat(['exit-survey']);
    console.log("Frame sequence: " + frame_sequence)
    // Return a study protocol with "frames" and "sequence" fields just like when
    // defining the protocol in JSON only
    return {
        frames: frames,
        sequence: frame_sequence
    };
    
    
}
