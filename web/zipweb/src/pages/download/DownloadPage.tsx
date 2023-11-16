import Image from "components/download/Image"
import Button from "../../components/download/Button"
import Text from "components/download/Text"
import { useEffect, useState } from "react"
import Box from "components/download/Box"

const DownloadPage = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1025)

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1025);
    }

    window.addEventListener("resize", handleResize);

  }, []);



  return(
    <>
      <Image $backgroundImage></Image>

      {(window.innerWidth >= 1025)
        ? null : <Image $logoImage></Image>
      }
      {(window.innerWidth >= 1025) 
        ? <Text>집에 오신 걸 환영합니다.</Text> 
        : 
          <Image $wordImage></Image>
      }  

      <Button 
        $responsiveButton 
        href="https://lastdance.kr/apk/app-release.apk" 
        download>
          {window.innerWidth >= 1025 ? <Image $blackDownloadIcon></Image> : <Image $whiteDownloadIcon></Image>}
          
          <div>다운로드</div>
      </Button>
    
    </>
  )
}

export default DownloadPage