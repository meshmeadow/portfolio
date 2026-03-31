import { useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';

import './SwiperCardsSlider.css';

const SwiperCardsSlider = ({ project }) => {
  const swiperRef = useRef(null);

  const handleVideoEnd = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  }, []);

  const handleSlideChange = useCallback((swiper) => {
    // Restart video when slide becomes active
    const activeSlide = swiper.slides[swiper.activeIndex];
    const video = activeSlide?.querySelector('video');
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  }, []);

  if (!project || !project.animations) return null;

  return (
    <div className="swiper-coverflow-container">
      {/* Project Info */}
      <div className="swiper-project-info">
        <span className="swiper-project-category">
          {project.category === 'lottie' ? 'Lottie Animation' : 'Video'}
        </span>
        <h3 className="swiper-project-title">{project.title}</h3>
        <p className="swiper-project-meta">{project.client} &bull; {project.year}</p>
      </div>

      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={5}
        modules={[EffectCoverflow, Autoplay]}
        className="swiper-coverflow"
        speed={400}
        loop={true}
        loopAdditionalSlides={5}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: -150,
          depth: 300,
          modifier: 1,
          scale: 0.85,
          slideShadows: false,
        }}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        onSlideChange={handleSlideChange}
      >
        {project.animations.map((anim) => (
          <SwiperSlide key={anim.id} className="swiper-card-slide">
            <div className="swiper-card-wrapper">
              <div className="swiper-card-content">
                {anim.video ? (
                  <video
                    src={anim.video}
                    autoPlay
                    muted
                    playsInline
                    className="swiper-card-video"
                    onEnded={handleVideoEnd}
                  />
                ) : (
                  <img src={anim.image} alt={anim.title} />
                )}
                <div className="swiper-card-label">
                  <span>{anim.title}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="swiper-hint">Swipe to see more</p>

      {/* Tags */}
      <div className="swiper-project-tags">
        {project.tags.map(tag => (
          <span key={tag} className="swiper-tag">{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default SwiperCardsSlider;
