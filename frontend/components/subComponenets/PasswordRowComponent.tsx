import React from 'react'
import Regenerate from '../icons/Regenerate'
import Trash from '../icons/Trash'

function PasswordRowComponent({ idx, Website, Password, regenerateHandler, deleteHandler}: any) {
  return (
    <tr className="hover">
        <th className='opacity-50'>{idx}</th>
        <td className='text-center'>{Website}</td>
        <td className='text-center'>{Password}</td>
        <td className='flex justify-center'>
        <button onClick={()=>regenerateHandler(Website)} className="btn btn-primary mr-1 px-2">
            <Regenerate />
            Regenerate
        </button>
        <button onClick={()=>deleteHandler(Website)} className="btn btn-error px-2">
            <Trash />
            Delete
        </button>
        </td>
    </tr>
  )
}

export default PasswordRowComponent