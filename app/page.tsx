import Image from 'next/image'

export default function Page() {
  return (
    <main
      style={{
        position: 'relative',
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        backgroundColor: '#000000',
        color: '#FFFFFF',
      }}
    >
      <Image
        src="/logo.png"
        alt="Gray Space"
        width={112}
        height={112}
        priority
        style={{ borderRadius: 24 }}
      />
      <h1
        style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: 4,
        }}
      >
        GRAY SPACE
      </h1>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 500,
          color: '#a1a1aa',
        }}
      >
        Three spaces. Your choice.
      </p>
    </main>
  )
}
