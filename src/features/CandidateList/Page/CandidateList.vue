<template>

  <div class="container py-4">

    <CandidateHeader />

    <CandidateSearch />

    <div class="row">

      <div class="col-md-3">

        <CandidateFilter />

      </div>

      <div class="col-md-9">

        <CandidateTable />

      </div>

    </div>

  </div>

</template>

<script setup lang="ts">

import CandidateHeader from '../components/CandidateHeader.vue'
import CandidateSearch from '../components/CandidateSearch.vue'
import CandidateFilter from '../components/CandidateFilter.vue'
import CandidateTable from '../components/CandidateTable.vue'

</script>
