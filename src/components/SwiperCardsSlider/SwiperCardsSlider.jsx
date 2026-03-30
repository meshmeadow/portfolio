import { useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

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
    <div className="swiper-cards-container">
      {/* Project Info */}
      <div className="swiper-project-info">
        <span className="swiper-project-category">
          {project.category === 'lottie' ? 'Lottie Animation' : 'Video'}
        </span>
        <h3 className="swiper-project-title">{project.title}</h3>
        <p className="swiper-project-meta">{project.client} &bull; {project.year}</p>
      </div>

      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="swiper-cards"
        speed={300}
        loop={true}
        cardsEffect={{
          slideShadows: true,
          perSlideOffset: 10,
          perSlideRotate: 3,
          rotate: true,
        }}
        touchEventsTarget="container"
        simulateTouch={true}
        allowTouchMove={true}
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
