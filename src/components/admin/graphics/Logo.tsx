import React from 'react'

const Logo: React.FC = () => {
  return (
    <div className="ffc-admin-logo">
      <img
        alt="Fondazione per la Ricerca sulla Fibrosi Cistica - ETS"
        height={180}
        src="/brand/ffc-ricerca-180.png"
        width={180}
      />
      <p className="ffc-admin-logo__name">Fondazione per la Ricerca sulla Fibrosi Cistica - ETS</p>
    </div>
  )
}

export default Logo
