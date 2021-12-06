import React from 'react'
import { useSelector } from 'react-redux'
import { useUtilities } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { SimpleImage } from '..'
import { useLocation } from 'react-router'

const ContentSlider = () => {
  const { t } = useTranslation()
  let { eventHandlerForWSIWYG } = useUtilities()
  let { pathname } = useLocation()
  if (pathname === '/') pathname = 'home'
  const pageData = useSelector(state => state.content[pathname])
  return (
    <div className="hero content-slider">
      {pageData?.slider?.slides && pageData.slider.slides.length > 0 && (
        <div id="carousel" className="carousel slide" data-bs-ride="carousel">
          {pageData?.slider?.slides?.length > 1 && (
            <div className="carousel-indicators">
              {pageData.slider.slides.map(({ title }, idx) => {
                return <button key={title} type="button" data-bs-target="#carousel" data-bs-slide-to={idx} className={idx === 0 ? 'active' : ''} aria-current="true" aria-label={`Slide ${idx}`}></button>
              })}
            </div>
          )}
          <div className="carousel-inner">
            {pageData.slider.slides.map(({ contentBody, title, imagePath, linkUrl, linkLabel }, key) => {
              return (
                <div key={title} className={key === 0 ? 'carousel-item active' : 'carousel-item'}>
                  <SimpleImage className="d-block w-100" src={imagePath} alt="carouselImage" />
                  <div className="carousel-caption d-none d-md-block">
                    <a onClick={eventHandlerForWSIWYG} href={linkUrl ? `/${linkUrl}` : '/#'} className="link-button">
                      <h1 className="text-white display-2 fw-bold">{title}</h1>
                    </a>
                    <p onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: contentBody }} />
                    {linkLabel?.trim()?.length > 0 && (
                      <a onClick={eventHandlerForWSIWYG} href={linkUrl ? `/${linkUrl}` : '/#'} className="btn btn-primary btn-lg text-white px-4 rounded-pill mt-4">
                        {linkLabel}
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {pageData?.slider?.slides && pageData.slider.slides.length > 0 && (
            <>
              <button className="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">{t('frontend.core.previous')}</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">{t('frontend.core.next')}</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
export { ContentSlider }
