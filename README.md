This is a simple memory game.
You have to find all the pairs.
You can play 4x3 4x4 5x4 6x4 6x5 grids.
You will have 10 seconds to memorize the position of pictures before the game starts.

![image](https://github.com/user-attachments/assets/d71b1af8-ca1e-492f-9e61-a5cc64e01a68)

Input errors are shown.

![image](https://github.com/user-attachments/assets/ffa9fbf9-3cd5-4287-a10d-84aa592c1ab7)

Congratulations alert and time to beat the game are shown

![image](https://github.com/user-attachments/assets/590acb15-5dcd-4b55-af1d-17d2923c1716)



What could you have done differently during the planning stages of your project to make the execution easier?
I whould try to make flip animation using mostly css. This requeries adding new div with the back image to the picture container and heavy changes to the creation of the field, but it will make animations run smoothly, because right now in some environments, animations sometimes are glitchy (I think this is because I have to change the src of img mid animation and JS and CSS sometimes are not in synk.)

Were there any requirements that were difficult to implement? What do you think would make them easier to implement in future projects?
Flip animations were a challenge. Planning to implement flip animations at the start would make it easier because it can be done mostly using HTML and CSS.

What would you add to or change about your application if given more time?
1. Dynamically resizable pictures and rearrangable rows and columns if the game field won't fit in the  viewport.
2. Savable leaderboard.
3. The theme of pictures selector (or just text input) and dynamically AI-generated images on the chosen theme.
