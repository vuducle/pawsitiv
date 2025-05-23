# Pawsitive – A Home for Every Cat

<p> We wanted to create an App where you can wander the Landscape and find stray cats. If you´re the first person to find the cat you can create a profile for the cat. Then everyone can see the status of the cat and different intel about her

- Name or Nickname
- food status
- adopted/still looking for a home

  With information like this you could get the common Area the cat moves in and it would simplify taking care of the cats if organisations like the PETA can get those infos to provide vaccine shots or take care.
</p>

<p align="center">
  <img src="https://th.bing.com/th/id/OIP.8V72qNvM70OfsBZJIu2b7gHaE8?rs=1&pid=ImgDetMain" alt="Pawsitive Banner" width="60%">
</p>

Pawsitive is a platform dedicated to helping stray cats find safe homes and caring owners.

## Prerequiresties 

- Docker Desktop (MacOS or Windows)
- WSL (Windows Subsystem for Linux)
- Node.js and NPM


## Features

- Create and share profiles of stray cats
- Browse cats available for adoption in your area (if possible)
- Connect with other cat lovers and rescuers (WebSocket or Socket.io ???)

| Name                | Role                 |
|---------------------|----------------------|
| Malte Szemlics      | Banner & Design       |
| Leticia Halm        | Code & Coordination     |
| Sophia Kawgan Kagan | User Flow & Frontend    |
| Vu Duc Le           | Backend Logic & Magic   |

## WIP

## SSL and certificates
WSL (and Docker obviously) is required for Windows-based systems.
```
# First change to the server folder, create a folder
cd server
mkdir -p secrets

# Run this command
openssl req -x509 -nodes -days 365 -newkey rsa:2048     
  -keyout secrets/nginx-selfsigned.key     
  -out secrets/nginx-selfsigned.crt     
  -subj "/C=US/ST=YourState/L=YourCity/O=YourOrganization/OU=YourDepartment/CN=localhost"

(eventually sudo at the beginning)

# Then run the docker compose file
docker compose up -d

# To stop a container
docker compose down

```

## Sneak Peek

<!-- Add screenshots or mockups here -->
<p align="center">
  <img src="https://placekitten.com/800/300" alt="Sneak Peek of UI" width="70%">
</p>

## Project Status
> This project is a work in progress! Stay tuned for cat-tastic updates.
> If we are sucessful with our idea we can extend our app for other animals :)

## Remember to stay Paw-sitive

##Gigacat was here to spread some pawsitivity 

          /| _ ╱|、  
         ( •̀ㅅ •́  )
        ＿ノ ヽ ノ＼＿ 
     /　`/ ⌒Ｙ⌒ Ｙ　  \
    ( 　(三ヽ人　 /　  |
    |　ﾉ⌒＼ ￣￣ヽ　  ノ
     ヽ＿＿＿＞､＿＿ ／
         ｜( 王 ﾉ〈 
         /ﾐ`ー―彡\ 
       |╰        ╯|   
      |     /\     |
      |    /  \    |                    
      |   /    \   |      
   

