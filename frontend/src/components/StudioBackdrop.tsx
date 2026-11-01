import React from 'react'

export const StudioBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Cool Porcelain Clinical Foundation */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 130% 90% at 30% 15%, #FBFDFF 0%, #EFF4F9 50%, #E1E8F2 100%)'
        }}
      />

      {/* Luminous Liquid Glass Studio Lighting Texture */}
      <div 
        className="absolute inset-0 opacity-25 mix-blend-multiply bg-cover bg-center transition-opacity"
        style={{
          backgroundImage: "url('/assets/liquid_glass_studio_balanced.jpg')"
        }}
      />

      {/* Subtle Studio Floor Grounding Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 45%, rgba(203,213,225,0.25) 100%)'
        }}
      />
    </div>
  )
}
