import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  // Bu örnek için, sadece e-posta ve şifre kontrolü yapıyoruz.
  // Gerçek bir uygulamada, bu bilgileri bir veri tabanına kaydetmek gerekecektir.
  if (email && password) {
    res.status(200).json({ message: 'Registration successful' });
  } else {
    res.status(400).json({ message: 'Invalid data' });
  }
}
