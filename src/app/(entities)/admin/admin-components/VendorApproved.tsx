'use client'

import { setAllVendorsData } from '@/app/redux/slices/vendors/vendordata'
import { RootState } from '@/app/redux/store'
import { IUser } from '@/model/user.model'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ─── Animation Variants ───────────────────────────────────────────────────────

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4} },
}

const rowVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.38 } },
  exit: {
    opacity: 0,
    x: 60,
    scale: 0.97,
    transition: { duration: 0.28 },
  },
}

const actionPanelVariants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    marginTop: 12,
    transition: { duration: 0.28 },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: { duration: 0.2},
  },
}

const rejectFormVariants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    marginTop: 10,
    transition: { duration: 0.25 },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: { duration: 0.18 },
  },
}

const toastVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.22 } },
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error'
}

// ─── Main Component ───────────────────────────────────────────────────────────

const VendorApproved = () => {
  const { allVendorsData } = useSelector((state: RootState) => state.vendors)
  const dispatch = useDispatch()

  const pendingVendors: IUser[] = Array.isArray(allVendorsData)
    ? allVendorsData.filter((p: IUser) => p.verificationStatus === 'pending')
    : []

  const approvedCount = Array.isArray(allVendorsData)
    ? allVendorsData.filter((p: IUser) => p.verificationStatus === 'approved').length
    : 0

  const rejectedCount = Array.isArray(allVendorsData)
    ? allVendorsData.filter((p: IUser) => p.verificationStatus === 'reject').length
    : 0

  const [activeVendorId, setActiveVendorId] = useState<string | null>(null)
  const [rejectOpenId, setRejectOpenId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' })

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2800)
  }

  const handleAction = (vendorId: string) => {
    setActiveVendorId((prev) => (prev === vendorId ? null : vendorId))
    setRejectOpenId(null)
    setRejectReason('')
  }

  const handleApprove = async (vendorId: string) => {
    try {
      setLoading(vendorId)
      const res = await axios.post('/api/admin/change-verification', {
        vendorID: vendorId,
        status: 'approved',
      })

      const updated = Array.isArray(allVendorsData)
        ? allVendorsData.filter((p: IUser) => p._id !== res.data.vendor._id)
        : []

      dispatch(setAllVendorsData(updated))
      setActiveVendorId(null)
      showToast('Vendor approved successfully!', 'success')
    } catch (error) {
      console.error(error)
      showToast('Something went wrong. Try again.', 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (vendorId: string) => {
    if (!rejectReason.trim()) return

    try {
      setLoading(vendorId)
      const res = await axios.post('/api/admin/change-verification', {
        vendorID: vendorId,
        status: 'reject',
        rejectReason,
      })

      const updated = Array.isArray(allVendorsData)
        ? allVendorsData.filter((p: IUser) => p._id !== res.data.vendor._id)
        : []

      dispatch(setAllVendorsData(updated))
      setRejectReason('')
      setRejectOpenId(null)
      setActiveVendorId(null)
      showToast('Vendor rejected.', 'error')
    } catch (error) {
      console.error(error)
      showToast('Something went wrong. Try again.', 'error')
    } finally {
      setLoading(null)
    }
  }

  const getInitials = (name: string) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??'

  const avatarColors = [
    { bg: '#1e3a5f', text: '#7eb8f7' },
    { bg: '#2d1f52', text: '#b89cf5' },
    { bg: '#0e3b2f', text: '#5dcaa5' },
    { bg: '#3b2000', text: '#f5a623' },
    { bg: '#3b0f1a', text: '#f7779a' },
  ]

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-4 py-8 md:px-8">
      {/* ── Toast ── */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm"
            style={{
              background: toast.type === 'success' ? '#0d1f0f' : '#1f0d0d',
              borderColor: toast.type === 'success' ? '#2a5c2a' : '#5c2a2a',
              color: toast.type === 'success' ? '#6ee87e' : '#f87171',
            }}
          >
            <span
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ background: toast.type === 'success' ? '#6ee87e' : '#f87171' }}
            />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-4xl"
      >
        {/* ── Page Header ── */}
        <motion.div variants={statCardVariants} className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Vendor Approvals
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Review and manage vendor verification requests
          </p>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          variants={pageVariants}
          className="mb-8 grid grid-cols-3 gap-3 sm:gap-4"
        >
          {[
            { label: 'Pending', value: pendingVendors.length, color: '#facc15' },
            { label: 'Approved', value: approvedCount, color: '#4ade80' },
            { label: 'Rejected', value: rejectedCount, color: '#f87171' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={statCardVariants}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-center"
            >
              <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
              <p
                className="text-2xl font-semibold tabular-nums"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Vendor List ── */}
        <AnimatePresence mode="popLayout">
          {pendingVendors.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 py-20 text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-2xl">
                ✓
              </div>
              <p className="text-sm font-medium text-zinc-300">All caught up!</p>
              <p className="mt-1 text-xs text-zinc-600">No pending vendor requests</p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3"
            >
              <AnimatePresence mode="popLayout">
                {pendingVendors.map((vendor: IUser, i: number) => {
                  const vid = String(vendor._id)
                  const isActive = activeVendorId === vid
                  const isRejectOpen = rejectOpenId === vid
                  const isLoading = loading === vid
                  const avatarColor = avatarColors[i % avatarColors.length]

                  return (
                    <motion.div
                      key={vid}
                      layout
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-5"
                      style={{ backdropFilter: 'blur(8px)' }}
                    >
                      {/* ── Vendor Info Row ── */}
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div
                          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                          style={{ background: avatarColor.bg, color: avatarColor.text }}
                        >
                          {getInitials(vendor.name || '')}
                        </div>

                        {/* Name & Shop */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">
                            {vendor.name}
                          </p>
                          <p className="truncate text-xs text-zinc-500">
                            {vendor.shopName}
                          </p>
                        </div>

                        {/* Badge */}
                        <span className="hidden sm:inline-flex items-center rounded-full border border-yellow-900/60 bg-yellow-950/60 px-2.5 py-0.5 text-xs font-medium text-yellow-400">
                          Pending
                        </span>

                        {/* Action Toggle Button */}
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleAction(vid)}
                          disabled={isLoading}
                          className="ml-auto rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-700 disabled:opacity-50"
                        >
                          {isActive ? 'Close' : 'Review'}
                        </motion.button>
                      </div>

                      {/* Phone */}
                      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                        <svg
                          className="h-3.5 w-3.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                          />
                        </svg>
                        {vendor.phone}
                      </div>

                      {/* ── Action Panel ── */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            variants={actionPanelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="overflow-hidden"
                          >
                            <div className="flex flex-wrap gap-2 border-t border-zinc-800 pt-4">
                              {/* Approve */}
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleApprove(vid)}
                                disabled={isLoading}
                                className="flex items-center gap-2 rounded-lg border border-green-900/60 bg-green-950/60 px-4 py-2 text-sm font-medium text-green-400 transition-colors hover:bg-green-900/60 disabled:opacity-50"
                              >
                                {isLoading ? (
                                  <Spinner />
                                ) : (
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                )}
                                Approve
                              </motion.button>

                              {/* Reject toggle */}
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() =>
                                  setRejectOpenId((prev) => (prev === vid ? null : vid))
                                }
                                disabled={isLoading}
                                className="flex items-center gap-2 rounded-lg border border-red-900/60 bg-red-950/60 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/60 disabled:opacity-50"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                              </motion.button>
                            </div>

                            {/* ── Reject Form ── */}
                            <AnimatePresence>
                              {isRejectOpen && (
                                <motion.div
                                  variants={rejectFormVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="overflow-hidden"
                                >
                                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <input
                                      type="text"
                                      placeholder="Enter reason for rejection…"
                                      value={rejectReason}
                                      onChange={(e) => setRejectReason(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleReject(vid)}
                                      className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-800 focus:ring-1 focus:ring-red-900 transition-colors"
                                    />
                                    <motion.button
                                      whileHover={{ scale: 1.03 }}
                                      whileTap={{ scale: 0.96 }}
                                      onClick={() => handleReject(vid)}
                                      disabled={isLoading || !rejectReason.trim()}
                                      className="flex items-center gap-2 rounded-lg border border-red-800 bg-red-900/70 px-4 py-2 text-sm font-medium text-red-200 transition-colors hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                      {isLoading ? <Spinner /> : null}
                                      Confirm reject
                                    </motion.button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner = () => (
  <svg
    className="h-4 w-4 animate-spin"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
)

export default VendorApproved
