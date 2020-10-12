const SubjectRepository = require('../repositories/subject.repository')
const KardexRepository = require('../repositories/kardex.repository')
const GroupRepository = require('../repositories/group.repository')

class KardexService {
	async getCarga(user) {
		return GroupRepository.find({ students: user.id })
			.populate('subject', 'name clave _id')
			.select('_id students group professor schedule')
			.exec()
	}

	async getKardex(user) {
		return KardexRepository.find({ user: user.id })
			.populate('subject', 'name clave _id')
			.select('_id grade user')
			.exec()
	}

	async updateSubjects(list) {
		const existingSubjects = await SubjectRepository.find()
		const existingSubjectsClaves = existingSubjects.map(
			(subject) => subject.clave
		)

		const toCreateSubjects = list.filter(
			(item) => !existingSubjectsClaves.includes(item['Clave'])
		)

		// Create missing data
		const createdSubjects = await SubjectRepository.insertMany(
			toCreateSubjects.map((item) => ({
				clave: item['Clave'],
				name: this.camelize(item['Materia']),
				career: '',
			}))
		)
		return [...existingSubjects, ...createdSubjects].reduce(
			(acc, el) => ({
				...acc,
				[el.clave]: el.id,
			}),
			{}
		)
	}

	async createKardexFromList(list, user) {
		// Fetch existing data
		const existingKardexItems = await KardexRepository.find({ user: user.id })
			.populate('subject')
			.exec()
		const existingKardexItemsClaves = existingKardexItems.map(
			(item) => item.subject.clave
		)

		const toCreateKardexItems = list.filter(
			(item) => !existingKardexItemsClaves.includes(item['Clave'])
		)

		const indexedSubjects = await this.updateSubjects(list)

		const createdKardexItems = await KardexRepository.insertMany(
			toCreateKardexItems.map((item) => ({
				subject: indexedSubjects[item['Clave']],
				grade: item['Calificación'],
				user: user.id,
			}))
		)

		return createdKardexItems
	}

	async createCargaFromList(list, user) {
		const existingGroups = await GroupRepository.find({})
			.populate('subject')
			.exec()
		const existingGroupsClaves = existingGroups.map(
			(group) => group.subject.clave + group.group
		)
		''.substr(-1)

		const indexedSubjects = await this.updateSubjects(
			list.map((item) => ({ ...item, Clave: item['Grupo'].substr(0, 3) }))
		)
		const toCreateGroups = list.filter(
			(item) => !existingGroupsClaves.includes(item['Grupo'])
		)

		const toUpdateGroups = existingGroups
			.filter((group) =>
				list.map((e) => e['Grupo'].substr(0, 3)).includes(group.subject.clave)
			)
			.map((group) =>
				GroupRepository.updateOne(
					{ _id: group._id },
					{
						$addToSet: {
							students: [user.id],
						},
					}
				)
			)

		const createdGroups = await GroupRepository.insertMany(
			toCreateGroups.map((item) =>
				this.transformGroup(item, indexedSubjects, user)
			)
		)
		await Promise.all(toUpdateGroups)
		return [...createdGroups]
	}

	transformGroup(item, subjects, user) {
		return {
			group: item['Grupo'].substr(-1),
			subject: subjects[item['Grupo'].substr(0, 3)],
			professor: this.camelize(item['Profesor']),
			students: user.id,
			schedule: this.transformSchedule(item),
		}
	}

	transformSchedule(item) {
		return {
			1: this.transformScheduleItem(item['Lunes']),
			2: this.transformScheduleItem(item['Martes']),
			3: this.transformScheduleItem(item['Miercoles']),
			4: this.transformScheduleItem(item['Jueves']),
			5: this.transformScheduleItem(item['Viernes']),
			6: this.transformScheduleItem(item['Sabado']),
		}
	}

	transformScheduleItem(item) {
		const [hours, room] = item.split('/')
		const [from, to] = hours.split('-')
		return { from, to, room }
	}

	camelize(str) {
		return str.replace(
			/[A-ZÑ]*\s?/g,
			(e) => e.substr(0, 1) + e.substr(1).toLowerCase()
		)
	}
}

module.exports = new KardexService()
