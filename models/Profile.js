const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    name: String,
    age: Number,
    location: String,
    email: String,
    phone: String,
    introduction: String,
    accomplishments: String,
    education: String,
    currentRole: String,
    experience: String,
    industryFocus: String,
    skills: String,
    freeTime: String,
    vision: String,
    goals: String,
    motivation: String,
    interests: String,
    companyCulture: String,
    leadershipStyle: String,
    communicationStyle: String,
    decisionMaking: String,
    conflictResolution: String,
    
    successorAge: Number,
    successorLocation: String,
    successorAccomplishments: String,
    successorEducation: String,
    successorRole: String,
    successorExperience: String,
    successorIndustryFocus: String,
    successorSkills: String,
    successorFreeTime: String,
    successorVision: String,
    successorGoals: String,
    successorMotivation: String,
    successorCommonInterests: String,
    successorCompanyCulture: String,
    successorLeadershipStyle: String,
    successorCommunicationStyle: String,
    successorDecisionMaking: String,
    successorConflictResolution: String,
});

// Create a model
const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
