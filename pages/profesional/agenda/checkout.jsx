import DashboardMenu from '@/components/dashboards/DashboardMenu'
import Header5 from '@/components/Header5'
import Header6 from '@/components/Header6'
import CheckoutCard from '@/components/dashboards/CheckoutCard'
import Paragraph from '@/components/Paragraph'
import DashboardTitleHeader from '@/components/dashboards/DashboardTitleHeader'
import FormSquareButton from '@/components/forms/FormSquareButton'
import SquareLink from '@/components/SquareLink'
import MainDashboardFrame from '@/components/dashboards/MainDashboardFrame'

import { formatSchedule, getLargeDate } from '../../../utils/dates'

import { useSessionContext } from '@/context/SessionContext'

import { jwtDecode } from 'jwt-decode'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

const AgendaCheckout = () => {
  const [role, setRole] = useState('')
  const [amount, setAmount] = useState(500)

  const {
    session,
    setSession,
    sessionDate,
    setSessionDate,
    sessionTime,
    setSessionTime,
    sessionConsultantId,
    setSessionConsultantId,
    sessionConsultantName,
    setSessionConsultantName,
    sessionConsultantPhoto,
    setSessionConsultantPhoto,
    sessionProfesionalId,
    setSessionProfesionalId
  } = useSessionContext()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm()

  const router = useRouter()

  useEffect(() => {
    const decoded = jwtDecode(localStorage.token)
    if (decoded) {
      setRole(decoded.Role)
    }

    // console.log('Checkout Session:', session)
    // console.log('Checkout Session Date:', sessionDate)
    // console.log('Checkout Session Time:', sessionTime)
    // console.log('Checkout Consultant ID:', sessionConsultantId)
    // console.log('Checkout Consultant Name:', sessionConsultantName)
  }, [])
 
  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GUAPOAPP_URI}session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Date: new Date(sessionDate),
            Transcript: '',
            Status: 'Scheduled',
            Paid: false,
            Professional: sessionProfesionalId,
            Consultant: sessionConsultantId,
            Consultancy_Type: session.consultancyType,
            About:
              session.consultancyType === 'Event'
                ? session.eventDescription
                : session.consultancyDescription
          })
        }
      )

      const json = await response.json()

      if (response.status === 201) {
        // console.log('JSON: ', json)
        alert('Sesión registrada correctamente')
        return
      }

      if (response.status === 400) {
        alert(`${json.error.error_message.message}`)
        return
      }
    } catch (error) {
      console.log('Error when registering consultant:', error)
    }
  }

  const goToPaymentMethods = (e) => {
    e.preventDefault()
    router.push(`/profesional/metodos-pago`)
  }

  const displayLoginError = (message) => {
    return <Paragraph text={message} textColor='text-red-600' />
  }

  return (
    <MainDashboardFrame footerColor='bg-primary-brownPod700'>
      {/* Menu */}
      <div className='w-2/6 flex flex-row h-full'>
        <DashboardMenu role={role} />
      </div>
      {/* Content */}
      <div className='w-4/6 h-full flex flex-row gap-5'>
        {/* Session Checkout Form */}
        <div className='flex flex-col gap-5 w-3/5'>
          {/* Title */}
          <div>
            <Header5
              text='Paga tu asesoría'
              textColor='text-primary-brownPod900'
            />
          </div>
          {/* Consultancy Type */}
          {/* <div className='flex flex-row gap-3'>
            <input
              className={``}
              type='radio'
              name='consultancyType'
              // id='role'
              value='Integral'
              {...register('consultancyType')}
              disabled
            />
            <label className='w-full' htmlFor='Integral'>
              <Header6
                text='Asesoría Integral'
                textColor='text-contrast-slateGray500'
              />
            </label>
            <input
              className={``}
              type='radio'
              name='consultancyType'
              // id='role'
              value='Event'
              {...register('consultancyType')}
              disabled
            />
            <label className='w-full' htmlFor='Event'>
              <Header6
                text='Asesoría para un evento'
                textColor='text-contrast-slateGray500'
              />
            </label>
          </div> */}
          {/* Session Information Cards */}
          <div className='flex flex-col gap-2 items-center w-3/5 mx-auto'>
            <CheckoutCard
              cardColor='bg-primary-brownPod600'
              profilePicture={sessionConsultantPhoto}
              consultantName={sessionConsultantName}
              consultancyType={session.consultancyType}
            />
            <CheckoutCard
              cardColor='bg-primary-brownPod700'
              profilePicture={sessionConsultantPhoto}
              sessionDate={getLargeDate(sessionDate)}
              sessionSchedule={formatSchedule(sessionTime)}
            />
          </div>
          {/* Checkout Form */}
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-3 w-full border border-secondary-satinLinen100 rounded-md p-5 items-center shadow-xl'
            >
              <Header6
                text='PAGO CON TARJETA'
                textColor='text-primary-brownPod800'
              />
              {/* CardName || Card Number */}
              <div className='flex flex-row gap-2 w-full'>
                {/* Card Name */}
                <div className='w-full flex flex-col gap-2 '>
                  <label className='w-full' htmlFor='cardName'>
                    <Header6 text='Nombre en la tarjeta' />
                  </label>
                  <input
                    className={`w-full p-3 text-contrast-slateGray500 rounded-md text-xl bg-contrast-slateGray300`}
                    placeholder='Nombre en la tarjeta'
                    type='text'
                    name='cardName'
                    // id='email'
                    {...register('cardName', {
                      required: {
                        value: true,
                        message: 'El nombre en la tarjeta es requerido'
                      }
                    })}
                  />
                  {errors?.cardName?.message &&
                    displayLoginError(errors.cardName.message)}
                </div>
                {/* Card Number */}
                <div className='w-full flex flex-col gap-2 '>
                  <label className='w-full' htmlFor='cardNumber'>
                    <Header6 text='Número de la tarjeta' />
                  </label>
                  <input
                    className={`w-full p-3 text-contrast-slateGray500 rounded-md text-xl bg-contrast-slateGray300`}
                    placeholder='Número de la tarjeta'
                    type='text'
                    name='cardNumber'
                    // id='email'
                    {...register('cardNumber', {
                      required: {
                        value: true,
                        message: 'El número de tarjeta es requerido'
                      }
                    })}
                  />
                  {errors?.cardNumber?.message &&
                    displayLoginError(errors.cardNumber.message)}
                </div>
              </div>
              {/* Card Expiration Date || Card CCV */}
              <div className='w-full flex flex-row gap-2'>
                {/* Expiration Date */}
                <div className='w-1/2 flex flex-col gap-2 '>
                  <label className='w-full' htmlFor='expiration'>
                    <Header6 text='Fecha de Expiración' />
                  </label>
                  <input
                    className={`w-full p-3 text-contrast-slateGray500 rounded-md text-xl bg-contrast-slateGray300`}
                    placeholder='MM/AA'
                    type='text'
                    name='expiration'
                    // id='email'
                    {...register('expiration', {
                      required: {
                        value: true,
                        message: 'La fecha de expiración es requerida'
                      }
                    })}
                  />
                  {errors?.expiration?.message &&
                    displayLoginError(errors.expiration.message)}
                </div>
                {/* CVV */}
                <div className='w-1/2 flex flex-col gap-2 '>
                  <label className='w-full' htmlFor='cvv'>
                    <Header6 text='CVV' />
                  </label>
                  <input
                    className={`w-full p-3 text-contrast-slateGray500 rounded-md text-xl bg-contrast-slateGray300`}
                    placeholder='CVV'
                    type='text'
                    name='cvv'
                    // id='email'
                    {...register('cvv', {
                      required: {
                        value: true,
                        message: 'El CVV es requerido'
                      }
                    })}
                  />
                  {errors?.cvv?.message &&
                    displayLoginError(errors.cvv.message)}
                </div>
              </div>
              {/* Checkout Button */}
              <div className='flex flex-row justify-center w-full'>
                <FormSquareButton
                  color='bg-primary-brownPod600'
                  textColor='text-contrast-slateGray50'
                  text={`Pagar ${amount}`}
                  width='w-2/6'
                />
              </div>
            </form>
          </div>
        </div>
        {/* Right Side */}
        <div className='flex flex-col w-2/5 justify-between'>
          {/* Header Banner */}
          <DashboardTitleHeader
            title='AGENDA'
            titleColor='text-primary-brownPod800'
            squareColor='bg-primary-brownPod800'
          />
          {/* Change Payment Method Button */}
          <div className='flex flex-row justify-start'>
            <SquareLink
              text='Cambiar método de pago'
              color='bg-primary-brownPod600'
              textColor='text-contrast-slateGray50'
              width='w-3/5'
              onClick={goToPaymentMethods}
            />
          </div>
        </div>
      </div>
    </MainDashboardFrame>
  )
}

export default AgendaCheckout
