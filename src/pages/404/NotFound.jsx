import { useEffect } from 'react'
import Particles from 'react-tsparticles'// Nhập react-tsparticles
import { loadFull } from 'tsparticles'// Nếu bạn muốn sử dụng các tính năng đầy đủ của tsparticles
import '~/styles/NotFoundPage.css'
import HomeIcon from '@mui/icons-material/Home'

const NotFoundPage = () => {
  // Hàm particlesInit sẽ được gọi khi tsParticles được khởi tạo
  const particlesInit = async (main) => {
    await loadFull(main)// Tải đầy đủ các tính năng của tsparticles
  };

  // Các cấu hình particles
  const particlesOptions = {
    fpsLimit: 60,
    particles: {
      number: {
        value: 160,
        density: {
          enable: true,
          area: 800
        }
      },
      color: {
        value: '#ffffff'
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: 1,
        random: {
          enable: true,
          minimumValue: 0.1
        },
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0,
          sync: false
        }
      },
      size: {
        value: 3,
        random: {
          enable: true,
          minimumValue: 1
        }
      },
      move: {
        enable: true,
        speed: 0.17,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out'
        },
      },
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        resize: false
      },
    },
    detectRetina: true
  }

  useEffect(() => {
    // Google Analytics Setup
    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    gtag('js', new Date());
    gtag('config', 'G-1752YPLP7H')
  }, [])

  const handleGoHome = () => {
    window.location.href = '/'
  }
  return (
    <div className='permission_denied'>
      {/* Đưa vào react-tsparticles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />
      <div className='denied__wrapper'>
        <h1>404</h1>
        <h3>
          LOST IN <span>SPACE</span> App-Name? Hmm, looks like that page doesn&apos;t
          exist.
        </h3>
        <img id='astronaut' src='./astronaut.svg' alt='Astronaut' />
        <img id='planet' src='./planet.svg' alt='Planet' />
        <a href='#'>
          <button className='denied__link' onClick={handleGoHome} >Go Home</button>
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage
