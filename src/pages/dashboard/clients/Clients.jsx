import React from 'react'
import Button from '../../../components/ui/button/Button'
import { Link } from 'react-router-dom'
function Clients() {
  return (
    <div>
      <Link to="/clients/add">
        <Button
          variant='blue'
        >
          Add Client
        </Button>
      </Link >
    </div>
  )
}

export default Clients