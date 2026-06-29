import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
        role
        uniqueId
        photo_url: photoUrl
        cover_photo_url: coverPhotoUrl
        username
        phone
        birthday
        province_id: provinceID
        city_id: cityID
        verification_level: verificationLevel
        huffadzProfile {
          city
          province
          bio
          verifiedJuz
          badge_tier: badgeTier
          gender
          interests
          hobbies
          juzProgress
          experiences
          certificationsList
          skillsList
          showSkills
          showExperiences
        }
        city { id name }
        province { id name }
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
        role
        uniqueId
        photo_url: photoUrl
        cover_photo_url: coverPhotoUrl
        username
        phone
        birthday
        province_id: provinceID
        city_id: cityID
        verification_level: verificationLevel
        huffadzProfile {
          city
          province
          bio
          verifiedJuz
          badge_tier: badgeTier
          gender
          interests
          hobbies
          juzProgress
          experiences
          certificationsList
          skillsList
          showSkills
          showExperiences
        }
        city { id name }
        province { id name }
      }
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      email
      role
      uniqueId
      photo_url: photoUrl
      cover_photo_url: coverPhotoUrl
      username
      phone
      birthday
      province_id: provinceID
      city_id: cityID
      verification_level: verificationLevel
      huffadzProfile {
        city
        province
        bio
        verifiedJuz
        badge_tier: badgeTier
        gender
        interests
        hobbies
        juzProgress
        experiences
        certificationsList
        skillsList
        showSkills
        showExperiences
      }
      city { id name }
      province { id name }
    }
  }
`;
