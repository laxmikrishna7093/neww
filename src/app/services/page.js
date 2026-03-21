'use client';
import { useEffect, useRef, useState } from "react";

/* ─── SERVICES DATA ──────────────────────────────────────── */
const SERVICES = [
  {
    id: "01",
    title: "Housekeeping",
    short: "Comfort Through Cleanliness",
    desc: "Hospitality-trained housekeeping staff for hotels, guesthouses, and residences.",
    accent: "#E8830A",
    photo: "https://images.pexels.com/photos/4107112/pexels-photo-4107112.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "02",
    title: "Security Services",
    short: "Guarding What Matters Most",
    desc: "Trained, uniformed and background-verified security personnel for all premises.",
    accent: "#E8830A",
    photo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTEhMVFhUVFxUWFxgXFxUYFxUXGBUXGBgYFxUYHSggGBolHRUYITEiJSkrLi4uGB8zODMsNygtLisBCgoKDg0OGhAQGi0lHyU1Ky0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAJMBVwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAAECAwUGBwj/xAA9EAABAwIDBQUHAwUAAgEFAAABAAIRAyEEMUEFElFhcQYTIoGRMkKhscHR8CNS4QcUYnLxM7LCNIKSorP/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQIDBAX/xAAoEQEBAAICAgEDBAIDAAAAAAAAAQIREiEDMUEyUYETM3GxBPCRodH/2gAMAwEAAhEDEQA/AOgZsam33QFXjn06Yiwt8UW17nidVg7Xk52hduPd7c16jldoYnvA8RJnPly9VmN2SXGBIyPGQujobHfU3yBAHOSVo4bZLGmbmPWFvykYcN+zbEw7G0w3cmOXxRb8dumGmOSk+qGN8E2i05dFB2H8Bd7xFp+Sz/lqkdokA3lCt2o6D6dPusiniiJac/kk2bTqbquMTybmGxRLScx8URTxzWwIP2WHQeRIyCk6tcgiZS4nydMK7HDMJq1BpF3BsX5+q5nCXeM+EK/bW82mcx5qbOKpds/tDttjg6nSFsnPIuYOTRoOeZ+fM94ptNzzUHsVRnabeSLvsmP8fdL6JkKdaOQReGcQ8NytHI21+KGwzd7d5kA9Bmtv+x7qahJLSfCQJz+qy2qRp4GoZ3DM2geYyRW0aIbuvGjmuPCxHoVTs/DbwDidRDhpcIrarS5hbrxGTv5Wedmm+MdT27od7s6nVzNIscehG474kei8jaYcfMcjw/OS9vwFD+42c6nmXU3NHUt3m/EheI4ikQZGR+BU/wCPl1oead7bXZeq2uamBqRu1wHUicqeIZO4eQddh8lPYz+6c6lWaSxw7uoI8TINiBqWHIdRrCytmt3TvXBkOB1BF5HObrttsMbVbTxjQP1fDVA92s0eLycBvBXnJv8An+043phVdmAVCzJwv1afZe0+80ggg/VSrbOIAET9Ee2j37AzKrTl1IjMtnefTB45uA18Q1Ea+wqwqs3XAd4zOPfbMB4+RGltClPLZdZD9OXuOf2fs54dcLpKNB8XAI5rUpYfki3MACeWezmOnM4zCFxjcEaq5jA2BukBbrGiU9WkCLKeZ8Q1BrSBe6M7pBMfGiMpuU04kaQUXYVqkSpbyRhG0YMwrmDVIpGomE55Ji5VOqFQJJKNFtcXQlvcAoKQzsgGJPBOAUxJlWNagGYCkrXNhJBuUxmLDG7zXgDnHouaxm1SSDuiDrbisHaO03OuCYiI5IbB7Q3bG4PH7rvx8Wo48vL3p1eE2kWNJGVrTOeqN/u2uvqRpb6LIwDGVGwRE6on+zLQDvSAfRRZFy02NoueRu3gj/spbTqOYwC3mcuiMdTLbjI5ws7bDXlhueI49EQX0yRW3jJ4fnyRzQXBZGEmb5rVw53TGhWliJRNMSMrqZpBXU2yqMSTMDLlqs7dNJNidlUYMgfdS2/SJY6coUsEd25y+CjtnF7tMkCZsBNhz/OKwtty201JHBubdW7sjmmITsstmUVbii5qNdRkc1FtCQfyyNjiK7P0N6pByAJ6fkrqWUSBGbJ3jw/L5rM7HYdpNRxzNh11g8V0VCWEg3EZ6XJz4ZZrnz9t8MekaeHa1s08iRLfPh+fRVYgyLZag6aWRdRsXZnIt5/D5KrEOa7k7Lqo5aO4u27B1JoRwj4Et+gXl/aLZ/d4urTizKrojPdd4mx5QvROwNX2mn/IfJ33WJ/UbCbmLbViWVGAujMOZInnbdWfjzlyulZ49RzDcIABAv8AA9PstvsnXa5z8I8wyuPCf2VW3Y4dcvRYtXECZBz4ZH7FAuqljt7eydIjMGZB8uK2+qaZeruN2tTdTcQZa+m7TNrmnTmCPkszae2IquqUz3Ut8dwBvEQ8MH7DnymBktvtHj2YinSxLLVKrC2qwe7UZ4S7z05AHVeTbcxBNSJsOHHVYZZ7vH/ltjjqbHbR25UDiKeIrbosCKtQAdLq7ZfbfG0CIrue39lb9Rp8z4h5Fcu4pg5VKVj3rsj2wpY5pbu93WaJdTmQR+5h1b8QujNwvm7AY59F7alNxa9hlpHH7cl9C4DFGrSZUFw9rXSLi4BsrnZCaYGp53UaD96o+/haGtiPfu51+hb8U74a0vdYNBJ6ASUJh8W2mwb3tmXEf5O8RHlMeSetk097RM9yyRtTebIG6p0a7uEp8S2MNZUOxwmIRNFkiSg6+CB8vRE0Ltf33BPRa86QnovtACi7FOFkAV3Bi5hWNa0aIGnUcc1a15S0exhA0CQbCqYVfvKTQJJSUyUkB88FxVlJvJS7mCQVdRaQvYry5Gjsim4XabDMfVa5JzvEfgQeyWgHrn5ovHEsG6MuKwy9ujHqFRxu6d0m0WlRxdUk2MhCupzmrsJT0KWoe6ycXTLXBwWhQqBwEp8fgyqsA2DebJ2zWyxl3ppgkiBlxVxhg4yFbh2SJBWXtF944Z3t8Pz5rm3uuj1DYra4a0iLn5rGxmOdUsbD5xx+yM/tw83MDRCYjCFphVJEXYSFZSpg+SQarWMjqmUM2kRcmynhqgNjYKbxDZOqrLcgIvwU1UdTsTDbtMR70mDkRMfRaWGrbpcCJEi3vC3xF1mYYlgAFiAJafy3UfFbOAcys0j3pJjUXiVnZ6axTi6YADmGxyj6fZDVWuLS4tsLTl5deSJxdAsGdpF9PMcef/Fk4zEu9mT0z/6o47VbXR9gcae+LT+5vnvBzfstj+qlA/29Oq0Xp1IP+rxf4tauO7K1HMxEEe7vA8Yc0heodq8D3+DrUxmWFzf9mw9vxaFy4zjk1y7jxNj5JiBxCDDS51pvI5hH/wBsZAOmv5oj6GGktmBexjPn/K7sZrtzWbch2gdXD20GktbuB/hsXEkiZF/diFgYnAll3TfUleobZ7OGs+m5pa0097eJNixzdIBkhwb6lcRtns29h3nVWEExYuJ85AXF5M5PJrbpxwvDenMOddOCI5yPPP8AhXvw4HEqTGcAr2nSFGiTfRep/wBOdnY3u+8oYlnc7xHcVGudfMkEHwTOk9F57g5c0BrS57nloABJAbcwB6r0zse2qzDNfThjwSJPsu13Xx7p45jMaguWnljp19elUqbjHN3XOPiEgjdZ4nEHVpO63Ie3kh8ZsgOdvOdccEsH2houeXVKjaVSBTFOo5oLTMvIJNwTAnXcC3Wt3gN0gg62PxWky+YxsZDcCAN1osbk/VWVcLJsTl5LRfSAEqllzfMJ8hoPizutHHh/KopYkuEZI7EUQhKNG9gnNaKr8PRhXOohUwRqpsqJGY0lYxqm0pnJbCJKmx6qIURdMCSUyra5OkbyrbGyCCHNAgoWnhtJgrvX4UPZBv1WdX2I0iYg8l3Ty9arkvj+zj6D3MeORW/igKtMEWI/MlXtHZJDbaaqGBLqZG8JHFVbL3Cks6psIzRyOp4WENirO3m5J8btdtKnaDUPsjT/AGKm/dUR2vj2MAZEvP8A+o581nsq712m+qyrvJLjJJkk6lbOyaLQZcN7K33Kzq5R+CoFzZj+Z+f5wRA2bNiIvlbjcmeH5zOw9Rnth0cxnGu6OOisbXJNxAsY13dJOn5GiytrXUU08A1rTMHgYy5/l8slgbUpAkwIi3px+y6vGVg1m++02aBnHTTj9slyuMr7zrCG8PzMox2WTJFIJ3ATlf5It5AsAmpYbX4fcrROlG6XZjz0CVCk3vGzpBOts0Q88MvzRTwuFc5xgaTH5qoyq5i0nVg8gG4OThmPzgnw7DTAJJvBDv2z8vl8kNh6RYS7IwbH6j6rWwBDjunpGh6HVO05isfiyQ0PvceIfUaH4dEO/ZcnfEkA2Ex/wor+zLXCONh5HLgrXVd0Wy1abEdOHyWfur4sbAYstxVNsZ29WkX8wvZtnVN+iwnVonrEH5LxvGgd5TqD3XieIioTfyK9Z7Ov/RA/aXD4z9Vy5yTJpPTyLa1I069SkRZj3NHQGx9L+anTqbnNpH5f88lvduMH3eMe+LVGsf0IG6f/AF+Kye71JEffj8Lrsxu8ZXPZqjMG4uZeTNiMvLleCuZ7UsAa8CZ8MgX4/wArYqVBRBdMADjn5m0fZcV2n7QVcUT4ju8KbQ1gvq43J6rz/wDI8W/LMp+XX4fJrx2VjtwLzciJ4yr8NgRPtLExDNT8SCfgqmOjIkdLLXijnPs6GlhHU3wd8NJ3g+nIcx0Q7LQyR0K9D7GYo06NNjxvd64sjhuM3t537SBf8K892FtzdltV0gizo1HGOWvJdZT2tUpUQKW5u1GFz5cJMuIbuweAPqVGW502xmOUt+3+/wBsXtE6arWud4Q92+/3iHVJPo2wGkHivQ+ybT/fPax25TYKw7sGGmHtFMBuR3Wgry2qx9U92GFzqjmsZB99zhA8xI813eNqGnXhriH020w97bfqsY0Pc0/7A9UsbrKflMm8L+HqBpqupRPJD7F2t3rBvAb4AJjJwOThy5aGyOfUW+3PoFVpKlgRbncEJWqQclcTSqBUgwrZlQNOUyW03q5olDMYrmlKhJ4UIUyoINBwSUyEkyYtAG1iru6ccxAWoKICtFMK7mXFz5wsmD8clTX2Q10bovOQXRuwwKzdq4sYZhqPyGQtLjoAnM78FcZ8ue2yylh2kuad4ghreJ+g5riA0vdLtT+Qidr7TqYmoaj88gBMNGgH5dLBYcHM9PueAW83rtje70IZgmGCHAdfy/yR1Oi5mRBHDXz5/llRRa1pORjMI0VgRIaAPrz+wt8lNXBVKpf2gTnYa6AcY9FoMdAid45k39ANTaOgOS53DEg+f5P2RmJxkeFpvF3aDkOQjJZ3FcqvauJLz4tJi8z1/IWcPXloOqlUaT+XP2UGO4eqrWoU7O5nr+egUqTNM/kFY2iTpn6lEAAaRyU2tccVBw8HjqjtkUZa8jOQOcCT+dFWKBdJNm/maLwVEASB569P4Ub3dRt+l1uoupBxPGQJ4SQiThoABHhHvaefDr8k4c7W1/aA4A5rRaXRYqpl3RfHJA1Sq4Bs+IA5+9kfX59VGoA++ujh+fBPXmwAGeWmRy4IcPiYlrtQcj5a9UdFw36ZG3GOaB1cJGRkNK9S7IV95jr5hj/Uf8Xm+1iS29jvN8PEbpEg+S63sbtFlKkx9V4a3u90k8WmPM+Erl83tUx1B/b/AAIe2lU4EtJ63HyPquGrVRSb4yNRE56SOBWv2s/qJLX06DQGmQXOu4jk3IecnovJdr7Zc4m8ylj5brjii4Te60tv7Xa438UZN9wHju6nquVxmLc83JjhkB0AVFWsTmVUSiY/N9lb8Q4TFMnJVJOCr8NinMMsMTnwPUaoaUgUw6DY23u6xVDEObIova8tbEkAyYnWMp5Lcp9o6VWrUJlu+5zm70akkAwc4XCSnDlPDHe1TPKdPdNhY0PoU6tJxjdF9Wn2SY1aSII/ieu2dihVbeA5sbw65EcWnivnzYHauvhbMIcyZLHCQZsb5iRZep7E21TrNbWw78tDnTJzp1B+08csja5Fod33aHqU1PB45tVsixFnNObTwTvRApDVFWEquVRH3UxCkCk5AQlOmIUgUBFJT3gkkD76saQhGFWxAk2AEkk2EayrsJZicQxjHPeYa0ST/Gp5LyjtJth+LqybMbam3gOJ4uP5kt7tLj3V3boMUgbD9x4n6BZbNnjOL6LXCTHus891lDCfg0RuzsONf+c0Y3DxYCSjMNhwDYSfWTwHTj/xXcuimKqvgBnlbLg3mdPzosuqCc8tIt6DRdMykMjeLkaTzP5pGqCrYEuu3Mmx0HQdLz81Ey+6rix6U5XjQa+fBWU4Bk34D7D6o19KJaI5u0tnfVCmje2RzJzPTkq2WjPYXHK50+6lToany5I5ggRxtxPPqYTYmhNz4Rw+5+ijbWRVhr5XjXQffVEMw4uRcjP+eCjgqci1h8T04fmSNNOAGgRJ/wC/BZ5V0+OQG7DEiTmchwn/AKtuls2Mrcx8iNVU2nL2DnPoF0uForK3traxRgTIBHHoUSzZ5bl6HL+F0uGwQJ8gFfUwAAsnM/um5RxeIwotAvOXkUPVwU+0PPULpcbhBI6/QrNxI3fauOIzHUaqpkK5fbjQ2mQ+9gQRwaSTPkuSx+0o8INgSAOF5MeZVna7tAC5waZA3Qej5j4BchV2hME57snqVy5W53fwVy0v2njSbSsV71J75Wv2R2CMbXfTc5waym6qQwNNR+6QN1gdaSXZn6rXGajC3bEJlMymSYaCTwAJPoF6Js3s1h6dXFNNLeNKlQq0v77epsYHOcKm/uWc0QLgZiOJVmAqVm4Wu7Zvdurf3rA84Znh7o0xuhjXSRT3jfT2k9peft2fVLGP3CGVH92x5gNL5gidIXSYHsK8l4r4inRLK7cPAY+oTUcxr2xuxYh+Z4FaePw/e0cRg8Vi8NTxNPFNr7xduUofTAeGkNHiBJJAGfqrNqduWU3444aod+o/CuovDZa8sa1lYmR4WlrLcUBlV+zWGwtNtXEvq1AMRVwzxRLAA5l2kFwkAtBJRO1dm7OoY7+0fRqMZAb3xrOJa6o1pp1N2w3QSQQZznRZ3abtNSxNKtSpUCxlXEDECS3wO7oMeA1oi5BMz7yxu0G134yqatQNDixrPDMQ0QDcm6A0O12yaWEdSw7SXV2s3sQ6fBvOMsa1ukN9ZC58FGbZ2rUxVZ1aru77g0HdEA7rQ0Wk6AINASBWhsfatTD1BUpmDqNHDg4ahZoKeU9h7p2b7QsrBtSk4b0CWE35scPkenILsKGJa9oc3I+oPA818x4TFPpuDmOLToQYI6Fd32b/AKjvpPH9yN5pgOewQTzc3Iu5iE9k9iLlElDYTGsqsbUpOD2OEtc0yCFMlUSzeSL1QXJb6eiWl6i56r3lElGgsNRJUSnTDRYwLlNubb7xxpUz4Gm5Hvnl/iPiiu1G2s6FI3yqO4cWj6+nFctTYRx+pV44/NTaOdTDgCdNdB0/OHGVEO3cssr3J5c+cfHJRFaM/ThzP5cpqri7lpGscAOarRbEUqu/YD1+Ljx6f8RLLCRrYE3JPEDXXyyzQ2FbNjE6j3RwB49P+o+m+L+042E2AHPhxjhHVTThgBk6zRmMy4n937jrHzTPqSZdMRZozI1JPD4W5qXdzZpkmZfy13R+aZwlVDWw3jc6k8Bzn5AqVKzh58TtYgaNAy6nW6yMQ4mS0Z66Aadf5WjjXE2cd0HMTpzPOwgcdUHUa7hujQangP8AEfHoqxKpbPdew3nZdOp0GS0amGkCbucYHAcYGlpvmqsLQDQB+FWvrgOkn2RA4km5gamI9VNXjVvchqrefEN28DyB5n1VW+5+fhHDU9SMvL1RODA3XdTHQW+YKmt/HUtntJqHxXAAyESbxHC3VdLg68WcIPHQ+enmub2HfecdXH0Fh8itoVItpwWTW3vTqMHXF+sfBFPrBcfg8aQJabEnwnhJyKNZtIOtMHgc/wCUpEZYdiNoVAY6nr7JXJdrNo9zQeSRcEA5XNrjjcLUrY32D/kf/Vy4f+puIFSg9gOTWnzkO+gU55cZ/wBLeXY6oT3jj7z2A9GNIHz+CA3ldXxhewgxO83QCwDr+pQgN0Y9Rz0RKP2Dj6dCuKlWm6ozdc0hj3U3guEbzXNIuOBtfos9r0znclSdOrxfb2r3gdQptaxlE0GtrF1Ylpc1xc9xI3nS0ZyBfOVg4vbuJq1XVXVnh7gGksPdy0ZNinAgLPJTJkcFSUEpQabSolLe4pOQDSkEySARsn3kvoqyka1rlKVUHKQKNk3uy3amtgHzTO9TcRv0j7Lubf2vjX1le9YPGNq02VGGWva1zTxDhIXzOvXf6a7Uc3B021D+nvPYDPsQ4wDwb9usXjU2O8eop3KMrRJ5TSkUyARKZIpIDlKOEcSZieWX5z+amKZFok8evDhPHgtBg6AakxFs5Osa6TAvClWNouNf8o4k6Ex16ZGuRaZhoX0JnPQHX0/NFYyjF7xzsXHjyH8q8U4IEeKMhYMb9OvWOCgHT4hB0b+0aW4n6cMlWy0aYhsQNY9p3IDT7cERQG9d1miYGkak8VU8Btpu7M6npHwAScZs7wsESOPBpj5DhrKVODBXsSM9ScmgacyOA1m6qpmJtvPOZPu8ATpHAfymaC8hvssABIycf2i3si08baK6qBAY208NB73281JhqVOfG65OXIaQNOPG6rqCXchc9Tl9fgrcbiGs6xkM4HyHM2QNOg4iX6md3T/7v3WgcFUIU3ESPDEDNx9kRw/d8uaehQgbx9p1yTnfTkovMw39xv0Fz9vNEvclrs9hn+EE8ApVqnd0j/i34x90Ni64bug3JcDAuSBfLyAQe0q7nAA2DiBui/O5+3xSy+WmFdRspkUmg5wJ6xJnzJRNV2ZGgJ9AuewW1HN8LxvD9zfaHVoz8vRGYrFg0nuYQZbuyOJMQed1llhcVzPd7GUN4U2/6t+SlUqkgAiRxvLechKniHEACPtZV4zGbrSJFgfknxPmGr4hzSwe00OdcXPsuB5Ec/muB7bYzebV5kfNdo7Fy2kZ/ebcmOXk/abH79RwGU/Vc/lxvOT8tOU47c+9IfVJyZqtguCcpm/P5JymFaeUiEyAdIJlIIBik0pimQEyEwKUpwZQBmyC0V6JewPb3tPeYbB7d8S0nQEWXpXbv+n2HcxuKwLSxlUS1g9kOvvMLXHwOEG05hwzC822MwHEUQ72TUZP/wCQt55ea9z7P41u+7CVz+jiCNx03p1rbhB4OgD/AGDczUKetzZb7eA4zCPpPLKjS1w0II+aqBXsfabs8x7jSxDb0zAc07pE8D+12cG08FzQ7C4feE4ioymTDnkMduA2DiIFgYngJ4XLhfcLk4OV6l2Uod3g6ZFzBNRh/a95LT0uL5tdGhE04bsBSw1b9YmqWOHgdApuiCJDbuaZHUEWO8Aui2lh+7La1H/xumAb7hjxUn/ubB8262Rh7OtDY+0Y3ab3S13/AI3H03HcCMvhe07oYuHeGgSJ7p5uMzTcB8SBr7zeB9nodh7UmKVQy8CWOmRUbEgg6mL8xfQq9pbApqJAVm+qnlMkXBOoOSTDHYZuI/8AiCNG8QOP/E7qlpBtOeZe7kNfzghmOLra8NGDmdXcvtKtDw0b5ucm/wAAfkBVpOztok2Nhm4ank48+HAc1U6tmW5CwPujieZ5D4SoV6pyJgG5jM9Y1OQA4KIaXGPZa2LCxJ0Fshrbkq0RmuiT7T9Tw4Nn6BWtp7g3nGXZk8zo0acPROwCbCA3Lr/H1VdWvL90DeLbkZCdN46RnxyTAmmd1suIGrjp68Bl5KhlZzyXNsDYOOe6P2jmZMnlYqNWkTG8Zc420DRqQOManUq5x0GSNDalzBIaBmZcTckDidbwOkq/eQlGpm7jYdBl6mSh6+0YncG9GZ90eep5BAG96A5znEAN8MnKcz9B5Ieti3Os3wj9x9o9GnLqfRCUm2BcZdnfIE3MDTNO56JDQbAeY0Fybkk8TrYBV1qs1WA5AEn5BQoOc6S0ZkneOXAQM3WA5IejSc97i0kkGJgEQM5HDop+x71K0m1RMg8k+MixBglzQSNYM3GuWqE3O7H6jYn3hdp4X084TVqgJYOp+FvmtstZRGOVlbWE2ruHx5H3hl5jMfEK3H4hrmOIIu0wZtlxWBUxQGZCAbinOJDNReMj1U3xa9D9SNalUMMB4VPi05HhdeX7VP6j+p+a9Lwx3WgEXbrpcj6SvM9qn9ap/sVw53fms+zpn7coFygM1MpYeg572saJc4wEyWNKcqumbBScZKQMUydyYc0A4CiXSk4ykEwUpJJkBJpSKipHJAH7FbvV6LTMd7TJgEndDwXGBcwATa6982z2ZbUp97hHd7SdLgGnxN/0cL2M8x5LwDYtfdr0nDMVGehMH4Er1/ZG06mHeX4d+6SZcw3p1IzD26O1DhB6gQrxmWt4ptnqturXOMwpq54nDDcrNy72neKkaGATyIeNFze9q3zHX6H5ruthY/D4qu2syaGKAcKlIxFVnvcqgBAIcIcLSADB5vtfsP8At600x+nUks4A+8zlxH8I8effEZ49bR2XXFdgoO/8tNp7njUptBLqXNzBJaMy3eGkp8LXAljxNN9ngZ8nt/yEgg6zwc0LB70yHBxa9pBa4WIcDLXciCB8Fv1qgr0xiGjddIbXYBZlUz4gP2PuRzLm5xE+TDjdnjdszF4d2HqFrocxwFxYVWG7XNJycMwdDIyJmtzQ2AXeE+KnUyDTOfFo3gZHuuBP7p1acVWdw8gGZpOOTHmPCT+x1uhIOoCxmksLqdUFoBO9IvSflvRq2wDgMwARdoBeOW4VmnXbD2l3oLKlqrcxlvRaR9R91qOYuEp7zXBs7tRhG4c5tZoOoj2TqDu3Bauq2VtQVmcHj2m8OY5H8yVENISTSkmTmaQ8PV0HpvxHoq8O7eJcbmCOnicLcPZCSS2+WcPghMuN3bzhPIGBHCwCnQPgB/xnzIkn1SSTCnEOIbTAMbzmgxmQRJvmOquwbAGCBGZ8ySmSSgSp+27k1seZdPyHoo4t0McRmGn5JJIDPxl6jafubkxpaAJ4jkq8QLAabzR5SkknDWFAt8bqu9fcHhGgsTMZE9UkksjjRYIY2P2j5Ibs8PATrvm/mEkkr7ib9Nam1B+mXayBPG+oyK5jHMDHgNsImNPIaZJJJ31P5Tj7Z4eTmVuYCkA2QBJSSXTGMGVqQFFzgLy4T0Zb5leSY4/qO6n5pJLycv38/wAf09HH9rEMUf2d/wDqaX+x/wDVySSaVvaKk1ld4aABAMDKTms/RJJBwmBVlJJAOEkkkAkySSZEpMTpICDjFxYi4IzBGUL0/B1SabHk+KAZ5n/uSSS28XyjP4alVtzmIhwIJBa4Ew5rhdptmF33Zh5xuzKT8V+q5zHOJIAO80uAI3Yg2zCSSy8/xVeL5edYwRJ5t+Jgo/sg4nGU6c+CqKlOoNHsFJ7wD0cxpBzGmZTpLXP6KjH6j0xJvqW/EUp//o716Ju0PipYaqfbewhztXbpAbPMAxPTgkksPH9Ua5eqBb4qAm+7UfTHJndUnhvQOe6OAMZABFYSq4VaDwfE8M3j+7ecWunqAPO+d0klpf8A1Lr5TJJK0v/Z",
  },
  {
    id: "03",
    title: "Customer Associate",
    short: "Your Brand's First Impression",
    desc: "Trained, groomed customer-facing associates for retail, banking, and events.",
    accent: "#E8830A",
    photo: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "04",
    title: "Customer Support",
    short: "Resolving Issues, Building Trust",
    desc: "Dedicated support executives for inbound/outbound calls, live chat and email.",
    accent: "#E8830A",
    photo: "https://images.pexels.com/photos/5904048/pexels-photo-5904048.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "05",
    title: "Packers & Movers",
    short: "Safe Moves, Zero Stress",
    desc: "Expert packing and relocation teams for homes, offices and industrial cargo.",
    accent: "#E8830A",
    photo: "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const PILLARS = [
  {
    icon: "✦",
    label: "Background Verified",
    desc: "Every staff member is police-verified before deployment.",
    tag: "Trust",
    gradient: "linear-gradient(135deg, #1A5C4E 0%, #0D2E26 100%)",
    accentLine: "#2ECC8F",
  },
  {
    icon: "⚡",
    label: "48-Hour Deployment",
    desc: "Trained staff placed within 24–48 hours of request.",
    tag: "Speed",
    gradient: "linear-gradient(135deg, #1B2F4B 0%, #0D1820 100%)",
    accentLine: "#4EA8DE",
  },
  {
    icon: "↻",
    label: "Free Replacement",
    desc: "If standards aren't met, we replace at no extra cost.",
    tag: "Guarantee",
    gradient: "linear-gradient(135deg, #3D1F6B 0%, #1A0D30 100%)",
    accentLine: "#A78BFA",
  },
  {
    icon: "◎",
    label: "24/7 Supervision",
    desc: "Dedicated supervisors available around the clock.",
    tag: "Support",
    gradient: "linear-gradient(135deg, #6B2D00 0%, #2E1200 100%)",
    accentLine: "#FB923C",
  },
];

/* ─── useInView HOOK ─────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ─── HERO SECTION ───────────────────────────────────────── */
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section style={{
      position: "relative", minHeight: "100vh", display: "flex",
      alignItems: "center", overflow: "hidden", background: "#080C0A",
    }}>
      <div style={{ position: "absolute", inset: "-2%" }}>
        <img
          src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt=""
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            opacity: mounted ? 0.22 : 0,
            transition: "opacity 1.4s ease",
          }}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,12,10,0.98) 0%, rgba(8,12,10,0.75) 45%, rgba(8,12,10,0.4) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "3px",
        background: "linear-gradient(to bottom, transparent, #E8830A 30%, #E8830A 70%, transparent)",
        opacity: mounted ? 1 : 0, transition: "opacity 1s ease 0.5s",
      }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "8rem 2.5rem 5rem", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem",
              opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease 0.2s",
            }}>
              <span style={{ display: "block", width: "28px", height: "2px", background: "#E8830A" }} />
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.68rem",
                letterSpacing: "0.28em", textTransform: "uppercase", color: "#E8830A", fontWeight: 700,
              }}>Professional Staffing Solutions</span>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "#fff",
              fontSize: "clamp(3rem, 7vw, 6.5rem)", lineHeight: 0.92, letterSpacing: "-0.03em",
              marginBottom: "1.5rem",
              opacity: mounted ? 1 : 0, transition: "opacity 0.9s ease 0.3s",
            }}>
              What<br />
              <span style={{ color: "#E8830A", fontStyle: "italic" }}>We Do.</span>
            </h1>

            <div style={{ width: "60px", height: "1px", background: "rgba(255,255,255,0.18)", marginBottom: "1.5rem", opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.5s" }} />

            <p style={{
              fontFamily: "'Barlow', sans-serif", fontSize: "0.95rem", lineHeight: 1.85,
              color: "rgba(255,255,255,0.42)", maxWidth: "380px",
              opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.55s",
            }}>
              Five core services. Background-verified, trained professionals — deployed to offices, homes, hotels and beyond.
            </p>

            <div style={{ display: "flex", gap: "0.85rem", marginTop: "2.25rem", opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.7s" }}>
              <button
                onClick={() => window.location.href = '/contact'}
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                  fontSize: "0.74rem", letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#111", background: "#E8830A",
                  padding: "0.85rem 2rem", borderRadius: "8px", border: "none", cursor: "pointer",
                }}>
                Hire Staff →
              </button>
              <button
                onClick={() => window.location.href = '/contact'}
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                  fontSize: "0.74rem", letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#fff", background: "transparent",
                  padding: "0.85rem 2rem", borderRadius: "8px", border: "1.5px solid rgba(255,255,255,0.2)", cursor: "pointer",
                }}>
                Apply for Job
              </button>
            </div>
          </div>

          <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.9s ease 0.5s" }}>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.63rem",
                letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 700,
              }}>— Why Choose Us</span>
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#fff",
              lineHeight: 1.1, marginBottom: "1.75rem",
            }}>
              Everything Your Business<br />
              <span style={{ color: "#E8830A", fontStyle: "italic" }}>Needs to Win</span>
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {PILLARS.map((p, i) => (
                <div key={i} style={{
                  background: p.gradient,
                  borderRadius: "12px", padding: "1.25rem",
                  border: "1px solid rgba(255,255,255,0.06)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: p.accentLine, opacity: 0.8 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: p.accentLine }}>{p.icon}</span>
                    <span style={{
                      fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.55rem",
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: p.accentLine, fontWeight: 700,
                      background: "rgba(255,255,255,0.07)", padding: "0.2rem 0.55rem", borderRadius: "50px",
                    }}>{p.tag}</span>
                  </div>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "0.35rem" }}>{p.label}</h4>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.72rem", lineHeight: 1.65, color: "rgba(255,255,255,0.45)" }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SERVICE CARD (compact) ─────────────────────────────── */
function ServiceCard({ svc, index }) {
  const [ref, vis] = useInView(0.08);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onClick={() => window.location.href = '/contact'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(30px)",
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
        cursor: "pointer",
      }}
    >
      <div style={{
        borderRadius: "14px", overflow: "hidden",
        border: `1px solid #E8830A30`,
        background: "#FFF3E8",
        boxShadow: hovered ? `0 20px 48px rgba(232,131,10,0.2), 0 0 0 1px #E8830A40` : "0 4px 20px rgba(232,131,10,0.1)",
        transform: hovered ? "translateY(-5px)" : "none",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}>
        {/* Image */}
        <div style={{ position: "relative", height: "200px", overflow: "hidden", background: "#F5D5A8" }}>
          <img
            src={svc.photo}
            alt={svc.title}
            loading="lazy"
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.5s ease",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to top, rgba(255,243,232,0.8) 0%, rgba(255,243,232,0.05) 50%, transparent 100%)`,
          }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "#E8830A" }} />
          <div style={{
            position: "absolute", top: "0.8rem", left: "0.8rem",
            background: "rgba(255,243,232,0.92)", backdropFilter: "blur(8px)",
            color: "#E8830A",
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
            fontSize: "0.62rem", letterSpacing: "0.14em",
            padding: "0.22rem 0.65rem", borderRadius: "50px",
            border: `1px solid #E8830A50`,
          }}>{svc.id}</div>
        </div>

        {/* Content */}
        <div style={{ padding: "1.1rem 1.2rem 1.2rem", background: "#FFF3E8" }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700,
            color: "#2a1500", lineHeight: 1.2, marginBottom: "0.4rem",
          }}>{svc.title}</h3>
          <p style={{
            fontFamily: "'Barlow', sans-serif", fontSize: "0.73rem",
            color: "rgba(60,30,0,0.55)", lineHeight: 1.65,
          }}>{svc.desc}</p>

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: "0.9rem", marginTop: "0.9rem",
            borderTop: `1px solid #E8830A25`,
          }}>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.65rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#E8830A", fontWeight: 700,
            }}>Enquire Now</span>
            <span style={{ color: "#E8830A", fontSize: "1rem" }}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SERVICES SECTION ───────────────────────────────────── */
function ServicesSection() {
  const [headerRef, headerVis] = useInView(0.2);

  return (
    <section style={{ background: "#F5E9D8", padding: "clamp(3.5rem, 7vw, 7rem) clamp(1.25rem, 4vw, 2.5rem)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        <div ref={headerRef} style={{ marginBottom: "clamp(2rem, 4vw, 3.5rem)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.85rem",
            opacity: headerVis ? 1 : 0, transition: "opacity 0.6s ease",
          }}>
            <span style={{ width: "28px", height: "2px", background: "#E8830A", display: "block" }} />
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.68rem",
              letterSpacing: "0.28em", textTransform: "uppercase", color: "#E8830A", fontWeight: 700,
            }}>What We Offer</span>
          </div>
          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1rem",
          }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#1a1a1a",
              letterSpacing: "-0.025em", lineHeight: 1.05,
              opacity: headerVis ? 1 : 0, transition: "opacity 0.7s ease 0.1s",
            }}>
              Our Core <span style={{ color: "#E8830A", fontStyle: "italic" }}>Services</span>
            </h2>
            <p style={{
              fontFamily: "'Barlow', sans-serif", fontSize: "0.84rem", lineHeight: 1.8,
              color: "rgba(0,0,0,0.5)", maxWidth: "320px",
              opacity: headerVis ? 1 : 0, transition: "opacity 0.7s ease 0.2s",
            }}>
              Every team member is trained, uniformed and background-verified before deployment.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {SERVICES.slice(0, 3).map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} index={i} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginTop: "1rem" }}>
          {SERVICES.slice(3).map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} index={i + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA / HIRING BANNER ────────────────────────────────── */
function CtaBanner() {
  const [ref, vis] = useInView(0.1);
  const [hov, setHov] = useState(false);

  return (
    <section style={{ position: "relative", overflow: "hidden", minHeight: "360px", display: "flex", alignItems: "center" }}>
      <img
        src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1400"
        alt="Team"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(8,12,10,0.97) 0%, rgba(8,12,10,0.75) 55%, rgba(8,12,10,0.25) 100%)" }} />

      <div ref={ref} style={{
        position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto",
        padding: "clamp(3rem, 6vw, 5rem) clamp(1.25rem, 4vw, 2.5rem)", width: "100%",
        opacity: vis ? 1 : 0, transition: "opacity 0.65s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1rem" }}>
          <span style={{ width: "24px", height: "2px", background: "#E8830A" }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.68rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "#E8830A", fontWeight: 700 }}>Join Our Team</span>
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)",
          fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: "0.85rem",
        }}>
          Looking for <span style={{ color: "#E8830A", fontStyle: "italic" }}>a Job?</span>
        </h2>
        <p style={{
          fontFamily: "'Barlow', sans-serif", fontSize: "0.88rem",
          lineHeight: 1.8, color: "rgba(255,255,255,0.42)", maxWidth: "360px", marginBottom: "2rem",
        }}>
          Skilled in security, cleaning, driving or customer service? We'll match you with the right employer.
        </p>
        <button
          onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          onClick={() => window.location.href = '/contact'}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
            fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase",
            color: hov ? "#111" : "#fff", background: hov ? "#E8830A" : "transparent",
            border: "2px solid #E8830A", padding: "0.9rem 2.25rem", borderRadius: "8px",
            cursor: "pointer", transition: "background 0.25s ease, color 0.25s ease",
          }}>
          Apply for a Job Now →
        </button>
      </div>
    </section>
  );
}

/* ─── ROOT PAGE ──────────────────────────────────────────── */
export default function ServicesPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #080C0A; }
      `}</style>
      <Hero />
      <ServicesSection />
      <CtaBanner />
    </>
  );
}