const SubjectRepository = require('../repositories/subject.repository')
const KardexRepository = require('../repositories/kardex.repository')
const GroupRepository = require('../repositories/group.repository')

class KardexService {
	async getCarga(user) {
		return GroupRepository.find({ students: user.id })
			.populate('subject', 'name key _id')
			.select('_id students group professor schedule')
			.exec()
	}

	async getKardex(user) {
		return KardexRepository.find({ user: user.id })
			.populate('subject', 'name clave _id')
			.select('_id grade user semester date')
			.exec()
	}

	async updateSubjects(list) {
		const existingSubjects = await SubjectRepository.find()
		const existingSubjectsClaves = existingSubjects.map(
			(subject) => subject['key']
		)

		const toCreateSubjects = list.filter(
			(item) => !existingSubjectsClaves.includes(item['key'])
		)

		// Create missing data
		const createdSubjects = await SubjectRepository.insertMany(
			toCreateSubjects.map((item) => ({
				key: item['key'],
				name: this.camelize(item['subject']),
				career: '',
			}))
		)
		return [...existingSubjects, ...createdSubjects].reduce(
			(acc, el) => ({
				...acc,
				[el.key]: el.id,
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
			(item) => item.subject.key
		)

		const toCreateKardexItems = list.filter(
			(item) => !existingKardexItemsClaves.includes(item['key'])
		)

		const indexedSubjects = await this.updateSubjects(list)

		const createdKardexItems = await KardexRepository.insertMany(
			toCreateKardexItems.map((item) => ({
				subject: indexedSubjects[item['key']],
				grade: item['grade'],
				date: item['date'],
				semester: item['semester'],
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

		const indexedSubjects = await this.updateSubjects(
			list.map((item) => ({ ...item, key: item['group'].substr(0, 3) }))
		)
		const toCreateGroups = list.filter(
			(item) => !existingGroupsClaves.includes(item['group'])
		)

		const toUpdateGroups = existingGroups
			.filter((group) =>
				list.map((e) => e['group'].substr(0, 3)).includes(group.subject.clave)
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
			group: item['group'].substr(-1),
			subject: subjects[item['group'].substr(0, 3)],
			professor: this.camelize(item['professor']),
			students: user.id,
			schedule: this.transformSchedule(item),
		}
	}

	transformSchedule(item) {
		return {
			1: this.transformScheduleItem(item['monday']),
			2: this.transformScheduleItem(item['tuesday']),
			3: this.transformScheduleItem(item['wednesday']),
			4: this.transformScheduleItem(item['thursday']),
			5: this.transformScheduleItem(item['friday']),
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
