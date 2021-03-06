import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Surat from 'App/Models/Surat'
import User from 'App/Models/User'

export default class WargaMailsController {
  public async index({ view, auth }: HttpContextContract) {
    await auth.use('web').authenticate()
    const data = await Surat
                  .query()
                  .select('*')
                  .where('id_pembuat', auth.use("web").user!.id)
    console.log(data)
    return view.render('warga/mail/history', { data: data })
  }

  public async create({ view, auth }: HttpContextContract) {
    await auth.use('web').authenticate()
    const id = auth.use('web').user!.id
    const data = await User.findOrFail(id)
    return view.render('warga/mail/new', { data: data})
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('web').authenticate()
    const kode_jenis = request.input('jenis_surat')
    const penandatangan = request.input('penandatangan')
    const keterangan = request.input('keterangan')

    try {
      await Surat.create({
        id_pembuat: auth.use('web').user!.id,
        kode_jenis: kode_jenis,
        penandatangan: penandatangan,
        keterangan: keterangan
      })

      response.redirect().back()
    } catch (error) {
      response.badRequest("Gagal Membuat Surat")
      
    }
  }

  public async show({ view, auth, request }: HttpContextContract) {
    await auth.use('web').authenticate()
    const data = await Surat.findOrFail(request.param('id'))

    return view. render('warga/mail/edit', {data:data})

  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
