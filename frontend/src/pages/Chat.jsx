import ChatWindow from '../components/ChatWindow'

export default function Chat({ sessionId, userName }) {
  return <ChatWindow sessionId={sessionId} userName={userName} />
}
